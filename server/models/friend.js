module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('friend', {
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  Friend.associate = models => {
    Friend.belongsTo(models.User, { as: 'user1', foreignKey: 'user1Id' });
    Friend.belongsTo(models.User, { as: 'user2', foreignKey: 'user2Id' });
  };

  return Friend;
};
