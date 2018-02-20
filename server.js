const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const jwt = require('jsonwebtoken');
const { makeExecutableSchema } = require('graphql-tools');
const {
  fileLoader,
  mergeTypes,
  mergeResolvers
} = require('merge-graphql-schemas');
const models = require('./models');
const morgan = require('morgan');
const path = require('path');

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, 'types')).concat('scalar JSON')
);
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, 'resolvers')).concat({ JSON: GraphQLJSON })
);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return next();
      }
      const { sub } = decoded;
      const user = await models.User.findOne({ where: { id: sub } });
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
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user
    }
  }))
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

models.sequelize.sync({ force: false }).then(() => {
  const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${server.address().port}`);
  });
});
