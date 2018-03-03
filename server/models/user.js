const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Name is already in taken'
        },
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'Name must only contain letters and numbers'
          },
          len: {
            args: [3, 25],
            msg: 'Name must be between 3 and 25 characters long'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email is already taken'
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
        allowNull: false,
        validate: {
          minLength: value => {
            if (value.length < 6) {
              throw new Error('Password must contain at least 6 characters');
            }
          }
        }
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en',
        validate: {
          isIn: {
            args: [['en', 'es']],
            msg: 'Language must be English or Spanish'
          }
        }
      },
      online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      hooks: {
        beforeSave: async user => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 15);
          }
        }
      }
    }
  );

  User.associate = models => {
    User.belongsToMany(User, {
      as: 'friends',
      through: models.Friend,
      foreignKey: 'user1Id',
      otherKey: 'user2Id'
    });
    User.belongsToMany(models.Game, { through: 'users_games' });
    User.belongsTo(models.Role);
    User.hasMany(models.Message);
  };

  User.prototype.authenticate = function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.changePassword = function(password) {
    this.password = password;
    return this.save();
  };

  User.prototype.isOwner = function() {
    return this.role.name === 'Owner';
  };

  User.prototype.isAdmin = function() {
    return this.role.name === 'Administrator';
  };

  User.prototype.isMod = function() {
    return this.role.name === 'Moderator';
  };

  User.prototype.isDev = function() {
    return this.role.name === 'Developer';
  };

  User.prototype.newToken = function() {
    return jwt.sign(
      {
        sub: this.id,
        iss: 'Trace'
      },
      this.password + process.env.SECRET,
      {
        expiresIn: '7d'
      }
    );
  };

  return User;
};
