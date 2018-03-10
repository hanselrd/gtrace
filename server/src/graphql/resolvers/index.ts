import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import path from 'path';
import { UnhandledError } from '../../errors';

let resolvers = mergeResolvers(
  (<any[]>fileLoader(path.join(__dirname, '.'))).concat({
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    JSON: GraphQLJSON
  })
);

const safeResolver = resolver => {
  return async (parent, args, context, info) => {
    try {
      const result = await resolver(parent, args, context, info);
      return result;
    } catch (err) {
      if (!err.time_thrown) {
        throw new UnhandledError(err);
      }
      throw err;
    }
  };
};

Object.keys(resolvers).forEach(gqlType => {
  Object.keys(resolvers[gqlType]).forEach(key => {
    const func = resolvers[gqlType][key];
    if (typeof func === 'function') {
      resolvers[gqlType][key] = safeResolver(func);
    }
  });
});

export default resolvers;
