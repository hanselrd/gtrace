const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const jwt = require('jsonwebtoken'); // refactor
const models = require('./models');
const schema = require('./schema');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(morgan('dev'));

app.use(async (req, res, next) => {
  // move this logic to its own file
  const token = req.headers['x-token'];
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return next();
      }
      const { sub } = decoded;
      const user = await models.User.findById(sub);
      jwt.verify(token, user.password + process.env.SECRET);
      req.user = user;
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

if (process.env.NODE_ENV === 'development') {
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
    })
  );
}

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

models.sequelize.sync({ force: false }).then(() => {
  const wss = http.createServer(app);
  wss.listen(port, () => {
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        // websocket server is only for auth users hence the Error if no token
        // unlike http server which is accessible by guest or auth users
        onConnect: async (connectionParams, webSocket) => {
          // refactor this too,
          // combine with function used to auth http
          const token = webSocket.upgradeReq.headers['x-token'];
          if (token) {
            try {
              const decoded = jwt.decode(token);
              if (!decoded) {
                throw new Error('Token is malformed');
              }
              const { sub } = decoded;
              const user = await models.User.findById(sub);
              jwt.verify(token, user.password + process.env.SECRET);
              return { user };
            } catch (err) {
              console.error(err);
              throw new Error(err.message);
            }
          }
          // do not allow guest users to access ws server
          throw new Error('Missing auth token');
        }
      },
      {
        server: wss,
        path: '/subscriptions'
      }
    );

    console.log(`Server running on port ${port}`);
  });
});
