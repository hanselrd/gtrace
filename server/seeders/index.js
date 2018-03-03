let seeders = null;

if (process.env.NODE_ENV === 'development') {
  seeders = require('./dev');
} else if (process.env.NODE_ENV === 'production') {
  seeders = require('./prod');
} else if (process.env.NODE_ENV === 'test') {
  seeders = require('./test');
}

module.exports = seeders;
