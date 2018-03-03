const models = require('../models');

module.exports = async () => {
  await models.User.bulkCreate(
    [
      { name: 'test1', email: 'test1@gmail.com', password: '123456' },
      { name: 'test2', email: 'test2@gmail.com', password: '123456' },
      {
        name: 'test3',
        email: 'test3@gmail.com',
        password: '123456',
        language: 'es'
      }
    ],
    { individualHooks: true }
  );

  await models.Role.bulkCreate([
    { name: 'Bot', abbreviation: 'Bot', color: 'orange' },
    { name: 'Owner', abbreviation: 'Owner', color: 'black' },
    { name: 'Administrator', abbreviation: 'Admin', color: 'red' },
    { name: 'Moderator', abbreviation: 'Mod', color: 'blue' },
    { name: 'Developer', abbreviation: 'Dev', color: 'brown' }
  ]);

  const users = await models.User.findAll();

  users.forEach(async user => {
    if (user.id === 1) {
      await user.setRole(2);
      await user.addFriend(3);
    }

    if (user.id % 2 === 0) {
      await user.setRole(3);
      await user.addFriend(1, { through: { accepted: true } });
    }

    if (user.id % 3 === 0) {
      await user.setRole(4);
      await user.addFriend(2);
    }

    await user.createMessage({ text: `My name is ${user.name}` });
    await user.createMessage({ text: `My id is ${user.id}` });
  });
};
