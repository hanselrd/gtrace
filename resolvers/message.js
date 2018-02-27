const { formatError } = require('../utils');
const models = require('../models');
const pubsub = require('../pubsub');

module.exports = {
  Query: {
    messages: (parent, args, { models }) =>
      models.Message.findAll({ include: [models.User] }),
    message: (parent, { id }, { models }) =>
      models.Message.findOne({ where: { id }, include: [models.User] })
  },
  Mutation: {
    addMessage: async (parent, args, { models, user }) => {
      if (!user) {
        return {
          status: false,
          errors: [{ path: 'auth', message: 'Invalid token' }]
        };
      }

      try {
        const message = await user.createMessage(args);

        pubsub.publish('messageAdded', { messageAdded: message });

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
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator('messageAdded')
    }
  }
};
