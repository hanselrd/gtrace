const Sequelize = require('sequelize');

let sequelize = null;

if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize('trace', 'postgres', 'postgres', {
    dialect: 'postgres',
    define: {
      underscored: true
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
      underscored: true
    }
  });
}

const models = {
  User: sequelize.import('./User')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
