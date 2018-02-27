const models = require('../models');

module.exports = async () => {
  await models.User.bulkCreate(
    [
      { name: 'test1', email: 'test1@gmail.com', password: '123456' },
      { name: 'test2', email: 'test2@gmail.com', password: '123456' },
      { name: 'test3', email: 'test3@gmail.com', password: '123456' },
      { name: 'test4', email: 'test4@gmail.com', password: '123456' },
      { name: 'test5', email: 'test5@gmail.com', password: '123456' },
      { name: 'test6', email: 'test6@gmail.com', password: '123456' },
      { name: 'test7', email: 'test7@gmail.com', password: '123456' },
      { name: 'test8', email: 'test8@gmail.com', password: '123456' },
      { name: 'test9', email: 'test9@gmail.com', password: '123456' },
      { name: 'test10', email: 'test10@gmail.com', password: '123456' }
    ],
    { individualHooks: true }
  );

  await models.Role.bulkCreate([
    { name: 'Owner', abbreviation: 'Owner', color: 'black' },
    { name: 'Administrator', abbreviation: 'Admin', color: 'red' },
    { name: 'Moderator', abbreviation: 'Mod', color: 'teal' },
    { name: 'Developer', abbreviation: 'Dev', color: 'brown' }
  ]);

  const users = await models.User.findAll();

  users.forEach(async user => {
    if (user.id === 1) {
      await user.addRole(1);
    }

    if (user.id % 2 === 0) {
      await user.addRole(2);
    }

    if (user.id % 3 === 0) {
      await user.addRole(3);
    }

    if (user.id % 4 === 0) {
      await user.addRole(4);
    }

    await user.createMessage({ text: `My name is ${user.name}` });
    await user.createMessage({ text: `My id is ${user.id}` });
  });
};
