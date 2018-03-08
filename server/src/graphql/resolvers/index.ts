import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import path from 'path';

export default mergeResolvers(
  (<any[]>fileLoader(path.join(__dirname, '.'))).concat({
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    JSON: GraphQLJSON
  })
);
