const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Username must be unique'
        },
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'Username can only contain letters and numbers'
          },
          len: {
            args: [3, 25],
            msg: 'Username must be between 3 and 25 characters long'
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  );

  return User;
};
