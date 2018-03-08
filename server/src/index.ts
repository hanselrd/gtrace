import 'reflect-metadata';
import { GraphQLServer, Options, PubSub } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import { createConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import express from 'express';
import schema from './graphql';
import { Friend, Message, User } from './models';

const options: Options = {
  port: +process.env.PORT || 4000,
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
        const decoded = jwt.decode(token);
        if (decoded) {
          const { sub } = <any>decoded;
          const user = await User.findOneById(sub);
          jwt.verify(token, user.password + process.env.SECRET);
          return { ...req, user, pubsub };
        }
      } catch (err) {}
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
});
