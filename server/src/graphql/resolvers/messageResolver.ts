import { AuthenticationError, SystemError } from '../../errors';
import { Message, User } from '../../models';

export default {
  Message: {
    user: parent => User.findOneById(parent.userId)
  },
  Query: {
    messages: () => Message.find(),
    message: (parent, { id }) => Message.findOneById(id)
  },
  Mutation: {
    addMessage: async (parent, args, { user, pubsub }) => {
      try {
        const message = await Message.create({ ...args, user }).save();
        pubsub.publish('messageAdded', { messageAdded: message });
        return message;
      } catch (err) {
        throw new SystemError(err);
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
