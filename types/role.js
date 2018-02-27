module.exports = `
  type Role {
    id: Int!
    name: String!
    abbreviation: String!
    color: String!
    users: [User!]
  }

  type Query {
    roles: [Role!]
    role(id: Int!): Role
  }

  type Mutation {
    addRole(name: String!, abbreviation: String!, color: String!): Response!
  }
`;
