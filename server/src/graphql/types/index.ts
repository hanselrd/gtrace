import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import path from 'path';

export default mergeTypes(
  (<any[]>fileLoader(path.join(__dirname, '.'))).concat(`
    scalar Date
    scalar Time
    scalar DateTime
    scalar JSON
  `)
);

// import { GraphQLScalarType } from "graphql";
// export declare const : GraphQLScalarType;
// export declare const Float: GraphQLScalarType;
// export declare const ID: GraphQLScalarType;
