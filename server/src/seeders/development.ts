import { /*Friend,*/ Message, Role, User } from '../models';

const newRole = (name: string, abbreviation: string, color: string) =>
  Role.create({
    name,
    abbreviation,
    color
  }).save();

const newUser = (id: number) =>
  User.create({
    name: `test${id}`,
    email: `test${id}@gmail.com`,
    password: '123456',
    dob: '1992-01-01',
    language: 'en'
  }).save();

export default async () => {
  /*const bot = */ await newRole('bot', 'bot', 'orange');
  const owner = await newRole('owner', 'owner', 'brown');
  const admin = await newRole('administrator', 'admin', 'red');
  const mod = await newRole('moderator', 'mod', 'blue');

  for (let i = 1; i <= 5; ++i) {
    const user = await newUser(i);
    if (i === 1) {
      user.role = owner;
    } else if (i % 2 === 0) {
      user.role = admin;
    } else if (i % 3 === 0) {
      user.role = mod;
    }
    await user.save();

    await Message.create({ user, text: `My name is ${user.name}` }).save();
    await Message.create({ user, text: `My id is ${user.id}` }).save();
  }
};
