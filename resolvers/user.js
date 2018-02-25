const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { withFilter } = require('graphql-subscriptions');
const { formatErrors } = require('../utils');
const pubsub = require('../pubsub');

module.exports = {
  Query: {
    user: (parent, { id }, { models }) => models.User.findById(id),
    users: (parent, args, { models }) => models.User.findAll(),
    currentUser: (parent, args, { models, user }) => {
      if (user) {
        return user;
      } else {
        return null;
      }
    },
    refreshToken: (parent, args, { models, user }) => {
      if (user) {
        return jwt.sign(
          {
            sub: user.id,
            iss: 'Trace'
          },
          user.password + process.env.SECRET,
          {
            expiresIn: '7d'
          }
        );
      } else {
        return null;
      }
    }
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

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return {
          status: false,
          errors: [{ path: 'password', message: 'Password is incorrect' }]
        };
      }

      const token = jwt.sign(
        {
          sub: user.id,
          iss: 'Trace'
        },
        user.password + process.env.SECRET,
        {
          expiresIn: '7d'
        }
      );

      return {
        status: true,
        payload: {
          token
        }
      };
    },
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);

        pubsub.publish('newUser', { newUser: user });

        return {
          status: true
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
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) {
          return {
            status: false,
            errors: [{ path: 'oldPassword', message: 'Password is incorrect' }]
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

        try {
          await models.User.update(
            { password: newPassword },
            { where: { id: user.id } }
          );

          const updatedUser = await models.User.findOne({
            where: { id: user.id }
          });

          const token = jwt.sign(
            {
              sub: user.id,
              iss: 'Trace'
            },
            updatedUser.password + process.env.SECRET,
            {
              expiresIn: '7d'
            }
          );

          return {
            status: true,
            payload: {
              token
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
