export default `
  type User {
    id: ID!
    name: String!
    email: String!
    dob: Date!
    language: String!
    createdAt: DateTime!
    friends: [User!]
    pendingFriends: [User!]
  }

  type Query {
    users: [User!]
    user(id: ID!): User
    currentUser: User
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, dob: Date!, language: String): Auth!
    login(email: String!, password: String!): Auth!
  }
`;
