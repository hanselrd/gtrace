const { formatErrors } = require('../utils');
const models = require('../models');
const Op = models.Sequelize.Op;

module.exports = {
  Query: {
    friends: async (parent, { userId }, { models }) => {
      const friendships = await models.Friend.findAll({
        where: {
          [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
          accepted: true
        },
        include: [
          { model: models.User, as: 'user1' },
          { model: models.User, as: 'user2' }
        ]
      });

      return friendships.map(friendship => {
        const user =
          friendship.user1.id !== userId ? friendship.user1 : friendship.user2;
        return user;
      });
    },
    pendingFriendRequests: async (parent, args, { models, user }) => {
      if (!user) {
        return null;
      }

      const friendships = await models.Friend.findAll({
        where: {
          user2Id: user.id,
          accepted: false
        },
        include: [
          { model: models.User, as: 'user1' },
          { model: models.User, as: 'user2' }
        ]
      });

      return friendships.map(friendship => {
        return friendship.user1;
      });
    }
  }
};
