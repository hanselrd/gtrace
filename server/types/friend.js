module.exports = `
  type Query {
    friends(userId: Int!): [User!]
    pendingFriendRequests: [User!]
  }
`;
