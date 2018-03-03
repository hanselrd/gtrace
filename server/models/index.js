const Sequelize = require('sequelize');

let sequelize = null;

if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize('trace', 'postgres', 'postgres', {
    dialect: 'postgres',
    define: {
      paranoid: true
    }
  });
} else if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true
    },
    define: {
      paranoid: true
    }
  });
}

const models = {
  Friend: sequelize.import('./friend'),
  Game: sequelize.import('./game'),
  Message: sequelize.import('./message'),
  Role: sequelize.import('./role'),
  User: sequelize.import('./user')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
