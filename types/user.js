module.exports = `
  type User {
    id: Int!
    username: String!
    email: String!
    language: String!
  }

  type Query {
    user(id: Int!): User!
    users: [User!]!
    currentUser: User
    refreshToken: String
  }

  type Mutation {
    login(email: String!, password: String!): Response!
    register(username: String!, email: String!, password: String!, language: String = "en"): Response!
    changePassword(oldPassword: String!, newPassword: String!): Response!
  }
`;
