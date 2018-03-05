const { formatErrors } = require('../../utils');
const models = require('../../models');

module.exports = {
  Query: {
    roles: (parent, args, { models }) =>
      models.Role.findAll({ include: [models.User] }),
    role: (parent, { id }, { models }) =>
      models.Role.findOne({ where: { id }, include: [models.User] })
  },
  Mutation: {
    addRole: async (parent, args, { models, user }) => {
      if (!user) {
        return {
          status: false,
          errors: [{ path: 'auth', message: 'Invalid token' }]
        };
      }

      if (!user.isOwner()) {
        return {
          status: false,
          errors: [{ path: 'role', message: 'You are not an owner' }]
        };
      }

      try {
        await models.Role.create(args);

        return {
          status: true
        };
      } catch (err) {
        return {
          status: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
