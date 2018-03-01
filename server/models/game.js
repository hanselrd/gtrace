module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Game.associate = models => {
    Game.belongsToMany(models.User, { through: 'user_game' });
  };

  return Game;
};
