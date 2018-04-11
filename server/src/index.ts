import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { GraphQLServer, Options } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import { createConnection } from 'typeorm';
import path from 'path';
import jwt from 'jsonwebtoken';
import express from 'express';
import seeder from './seeders';
import { Friend, Message, Role, User } from './models';
import { UserResolver } from './graphql/resolvers';

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
  // playground: process.env.NODE_ENV !== 'production' ? '/playground' : false,
  playground: '/playground',
  formatError
};

const bootstrap = async () => {
  const schema: any = await buildSchema({ resolvers: [UserResolver] });

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
            return { ...req, user };
          }
        } catch (err) {}
      }
      return { ...req };
    }
  });

  server.express.use(express.static(path.join(__dirname, 'client')));

  server.express.get('*', (req, res, next) => {
    if (!server.options.playground || req.url !== server.options.playground) {
      return res.sendFile(path.join(__dirname, 'client', 'index.html'));
    }
    return next();
  });

  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: process.env.NODE_ENV !== 'production',
    entities: [Friend, Message, Role, User]
  });

  if ((await User.find()).length === 0) {
    await seeder();
  } else {
    await User.createQueryBuilder('user')
      .update()
      .set({ online: false })
      .where('online = true')
      .execute();
  }

  server.start(options, ({ port }) => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrap();
