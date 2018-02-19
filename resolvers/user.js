const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatErrors } = require('../utils');

module.exports = {
  Query: {
    user: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
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
      const user = await models.User.findOne({ where: { email }, raw: true });
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
        return {
          status: true
        };
      } catch (err) {
        console.error(err);
        return {
          status: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
