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
          msg: 'Name is already in use'
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
      as: 'Friends',
      through: 'friends',
      foreignKey: 'user_1_id',
      otherKey: 'user_2_id'
    });
    User.belongsToMany(models.Game, { through: 'user_game' });
    User.belongsToMany(models.Role, { through: 'user_role' });
    User.hasMany(models.Message);
  };

  User.prototype.authenticate = function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.changePassword = function(password) {
    this.password = password;
    return this.save();
  };

  // internal
  User.prototype.hasRole = function(name) {
    return this.roles.filter(role => role.name === name).length > 0;
  };

  User.prototype.isOwner = function() {
    return this.hasRole('Owner');
  };

  User.prototype.isAdmin = function() {
    return this.hasRole('Administrator');
  };

  User.prototype.isMod = function() {
    return this.hasRole('Moderator');
  };

  User.prototype.isDev = function() {
    return this.hasRole('Developer');
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
