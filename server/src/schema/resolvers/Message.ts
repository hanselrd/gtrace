import { AuthError, SystemError } from '../../errors';
import { Message } from '../../models';

export default {
  Query: {
    messages: () => Message.find(),
    message: (parent, { id }) => Message.findOneById(id)
  },
  Mutation: {
    addMessage: async (parent, args, { user, pubsub }) => {
      if (!user) {
        throw new AuthError();
      }

      try {
        const message = await Message.create(args).save();
        pubsub.publish('messageAdded', { messageAdded: message });
        return message;
      } catch (err) {
        throw new SystemError({ message: err.message });
      }
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator('messageAdded')
    }
  }
};
