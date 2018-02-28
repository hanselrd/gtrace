const { makeExecutableSchema } = require('graphql-tools');
const {
  fileLoader,
  mergeTypes,
  mergeResolvers
} = require('merge-graphql-schemas');
const GraphQLDate = require('graphql-date');
const GraphQLJSON = require('graphql-type-json');
const path = require('path');

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, 'types')).concat('scalar Date scalar JSON')
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, 'resolvers')).concat({
    Date: GraphQLDate,
    JSON: GraphQLJSON
  })
);

module.exports = makeExecutableSchema({ typeDefs, resolvers });
