import 'reflect-metadata';
import { GraphQLServer, Options, PubSub } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import { createConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import express from 'express';
import schema from './schema';
import { Friend, Message, User } from './models';
import { AuthError, SystemError } from './errors';

const options: Options = {
  endpoint: '/graphql',
  subscriptions: '/graphql',
  playground: process.env.NODE_ENV !== 'production' ? '/playground' : false,
  formatError
};

const pubsub = new PubSub();
const server = new GraphQLServer({
  schema,
  context: async req => {
    let token = '';
    if (req.request) {
      token = <string>req.request.get('authorization');
    } else if (req.connection) {
      token = <string>req.connection.context['authorization'];
    }
    if (token) {
      try {
        token = token.replace('Bearer ', '');
        console.log('token:', token);
        const decoded = jwt.decode(token);
        if (!decoded) {
          throw new AuthError({ message: 'Could not decode token' });
        }
        const { sub } = <any>decoded;
        const user = await User.findOneById(sub);
        jwt.verify(token, user.password + process.env.SECRET);
        return { ...req, user, pubsub };
      } catch (err) {
        console.error(err.message);
        throw new AuthError({ message: err.message });
      }
    }
    return { ...req, pubsub };
  }
});

createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [Friend, Message, User]
}).then(() => {
  server.start(options, ({ port }) => {
    console.log(`Server is running on port ${port}`);
  });

  User.find().then(users => {
    users.forEach(async user => {
      if (user.id % 2 === 0) {
        await Friend.create({
          user1: user,
          user2: users[0],
          accepted: true
        }).save();
      } else if (user.id % 3 === 0) {
        await Friend.create({ user1: user, user2: users[1] }).save();
      }
    });
  });
});
