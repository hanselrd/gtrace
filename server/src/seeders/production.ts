import { Message, Role, User } from '../models';

const newRole = (name: string, abbreviation: string, color: string) =>
  Role.create({
    name,
    abbreviation,
    color
  }).save();

export default async () => {
  const bot = await newRole('bot', 'bot', 'orange');
  /*const owner = */ await newRole('owner', 'owner', 'brown');
  /*const admin = */ await newRole('administrator', 'admin', 'red');
  /*const mod = */ await newRole('moderator', 'mod', 'blue');

  const system = await User.create({
    name: '[SYSTEM]',
    email: 'system@system.bot',
    password: process.env.SECRET,
    dob: new Date(),
    role: bot
  }).save();

  await Message.create({ text: 'Welcome to Trace!', user: system }).save();
};
