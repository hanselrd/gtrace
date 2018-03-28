import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './types';
import resolvers from './resolvers';
import * as directiveResolvers from './directives';

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers
});
