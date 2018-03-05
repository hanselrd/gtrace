const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { graphqlExpress } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { auth, models, schema, seeders } = require('./server');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(morgan('dev'));

app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    try {
      req.user = await auth(token);
    } catch (err) {
      console.error(err);
      return next();
    }
  }
  return next();
});

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user
    }
  }))
);

if (process.env.NODE_ENV !== 'production') {
  // app.use(
  //   '/graphiql',
  //   graphiqlExpress({
  //     endpointURL: '/graphql',
  //     subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
  //   })
  // );
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
}

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

models.sequelize
  .sync({ force: process.env.NODE_ENV === 'test' })
  .then(async () => {
    if ((await models.Role.findAll({ raw: true })).length === 0) {
      await seeders();
    } else {
      await models.User.update({ online: false }, { where: { online: true } });
    }

    const wss = http.createServer(app);
    wss.listen(port, () => {
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
          onConnect: async (connectionParams, webSocket) => {
            let token = connectionParams['authorization'];

            if (token) {
              try {
                const user = await auth(token);
                user.online = true;
                user.save();
                webSocket.user = user;
                return { models, user };
              } catch (err) {
                console.error(err);
                throw new Error(err.message);
              }
            }
            throw new Error('Missing auth token');
          },
          onDisconnect: webSocket => {
            const { user } = webSocket;
            if (user) {
              user.online = false;
              user.save();
            }
          }
        },
        {
          server: wss,
          path: '/graphql'
        }
      );

      console.log(`Server running on port ${port}`);
    });
  });
