import 'reflect-metadata';
import { GraphQLServer, Options, PubSub } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import { createConnection } from 'typeorm';
import path from 'path';
import jwt from 'jsonwebtoken';
import express from 'express';
import schema from './graphql';
import { Friend, Message, Role, User } from './models';

const options: Options = {
  port: +process.env.PORT || 4000,
  endpoint: '/graphql',
  subscriptions: {
    path: '/graphql',
    onConnect: async (connectionParams, webSocket) => ({
      ...connectionParams,
      webSocket
    }),
    onDisconnect: async webSocket => {
      let user = <User>webSocket.user;
      if (user) {
        user.online = false;
        await user.save();
      }
    }
  },
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
          const user = await User.findOneById(sub, { relations: ['role'] });
          jwt.verify(token, user.password + process.env.SECRET);
          if (req.connection) {
            user.online = true;
            await user.save();
            req.connection.context.webSocket.user = user;
          }
          return { ...req, user, pubsub };
        }
      } catch (err) {}
    }
    return { ...req, pubsub };
  }
});

server.express.use(express.static(path.join(__dirname, 'client')));

server.express.get('*', (req, res, next) => {
  if (!server.options.playground || req.url !== server.options.playground) {
    return res.sendFile(path.join(__dirname, 'client', 'index.html'));
  }
  return next();
});

createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [Friend, Message, Role, User]
}).then(() => {
  server.start(options, ({ port }) => {
    console.log(`Server is running on port ${port}`);
  });
});
