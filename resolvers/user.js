const { withFilter } = require('graphql-subscriptions');
const { formatErrors } = require('../utils');
const models = require('../models');
const pubsub = require('../pubsub');

module.exports = {
  Query: {
    users: (parent, args, { models }) =>
      models.User.findAll({ include: [models.Message, models.Role] }),
    user: (parent, { id }, { models }) =>
      models.User.findOne({
        where: { id },
        include: [models.Message, models.Role]
      }),
    currentUser: (parent, args, { models, user }) => {
      if (user) {
        return user;
      } else {
        return null;
      }
    },
    newToken: (parent, args, { models, user }) => {
      if (user) {
        return user.newToken();
      } else {
        return null;
      }
    },
    onlineUsers: (parent, args, { models }) =>
      models.User.findAll({
        where: { online: true },
        include: [models.Message, models.Role]
      })
  },
  Mutation: {
    login: async (parent, { email, password }, { models }) => {
      const user = await models.User.findOne({ where: { email } });

      if (!user) {
        return {
          status: false,
          errors: [{ path: 'email', message: 'Email does not exist' }]
        };
      }

      const valid = await user.authenticate(password);

      if (!valid) {
        return {
          status: false,
          errors: [{ path: 'password', message: 'Password is incorrect' }]
        };
      }

      return {
        status: true,
        payload: {
          token: user.newToken()
        }
      };
    },
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);

        pubsub.publish('newUser', { newUser: user });

        return {
          status: true,
          payload: {
            token: user.newToken()
          }
        };
      } catch (err) {
        return {
          status: false,
          errors: formatErrors(err, models)
        };
      }
    },
    changePassword: async (
      parent,
      { oldPassword, newPassword },
      { models, user }
    ) => {
      if (user) {
        try {
          const valid = await user.authenticate(oldPassword);

          if (!valid) {
            return {
              status: false,
              errors: [
                { path: 'oldPassword', message: 'Password is incorrect' }
              ]
            };
          }

          if (oldPassword === newPassword) {
            return {
              status: false,
              errors: [
                {
                  path: 'newPasword',
                  message: 'New password cannot match old password'
                }
              ]
            };
          }

          await user.changePassword(newPassword);

          return {
            status: true,
            payload: {
              token: user.newToken()
            }
          };
        } catch (err) {
          return {
            status: false,
            errors: formatErrors(err, models)
          };
        }
      } else {
        return {
          status: false,
          errors: [{ path: 'auth', message: 'Invalid token' }]
        };
      }
    }
  },
  Subscription: {
    newUser: {
      // must have valid token to see new users as they register
      // because onConnect throws an error for missing token
      subscribe: () => pubsub.asyncIterator('newUser')
    }
    // newFriend: {
    //   subscribe: withFilter(
    //     () => pubsub.asyncIterator('newFriend'),
    //     (parent, args, { user }) => {
    //       return parent.newFriend.id === user.id;
    //     }
    //   )
    // }
  }
};
