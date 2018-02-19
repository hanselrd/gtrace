const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Username is already in use'
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
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Email is already in use'
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Email is invalid'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Password cannot be empty'
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          user.password = await bcrypt.hash(user.password, 15);
        }
      }
    }
  );

  return User;
};
