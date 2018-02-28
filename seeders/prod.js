const models = require('../models');

module.exports = async () => {
  await models.User.bulkCreate([
    {
      name: '[SYSTEM]',
      email: 'system@system.system',
      password: process.env.SECRET
    }
  ]);

  await models.Role.bulkCreate([
    { name: 'Bot', abbreviation: 'Bot', color: 'orange' },
    { name: 'Owner', abbreviation: 'Owner', color: 'black' },
    { name: 'Administrator', abbreviation: 'Admin', color: 'red' },
    { name: 'Moderator', abbreviation: 'Mod', color: 'blue' },
    { name: 'Developer', abbreviation: 'Dev', color: 'brown' }
  ]);

  const bot = await models.User.findById(1);
  await bot.setRole(1);
  await bot.createMessage({ text: 'Welcome to Trace!' });
};
