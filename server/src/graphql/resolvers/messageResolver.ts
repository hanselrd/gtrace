import { SystemError } from '../../errors';
import { Message, User } from '../../models';

export default {
  Message: {
    user: parent => parent.user || User.findOneById(parent.userId)
  },
  Query: {
    messages: () => Message.find({ order: { id: 'DESC' }, take: 10 }),
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
    },
    deleteMessage: async (parent, { id }, { pubsub }) => {
      try {
        await Message.removeById(id);
        pubsub.publish('messageDeleted', { messageDeleted: id });
        return id;
      } catch (err) {
        throw new SystemError(err);
      }
    },
    deleteAllMessages: async (parent, args, { pubsub }) => {
      try {
        await Message.createQueryBuilder('message')
          .delete()
          .execute();
        pubsub.publish('allMessagesDeleted', { allMessagesDeleted: true });
        return true;
      } catch (err) {
        throw new SystemError(err);
      }
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator('messageAdded')
    },
    messageDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator('messageDeleted')
    },
    allMessagesDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator('allMessagesDeleted')
    }
  }
};
