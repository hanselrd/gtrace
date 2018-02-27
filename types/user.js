module.exports = `
  type User {
    id: Int!
    name: String!
    email: String!
    language: String!
    online: Boolean!
    messages: [Message!]
    roles: [Role!]
  }

  type Query {
    users: [User!]
    user(id: Int!): User
    currentUser: User
    newToken: String
    onlineUsers: [User!]
  }

  type Mutation {
    login(email: String!, password: String!): Response!
    register(name: String!, email: String!, password: String!, language: String): Response!
    changePassword(oldPassword: String!, newPassword: String!): Response!
  }

  type Subscription {
    newUser: User!
  }
`;
