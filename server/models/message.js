module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.User);
  };

  return Message;
};
