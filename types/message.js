module.exports = `
  type Message {
    id: Int!
    text: String!
    user: User!
  }

  type Query {
    messages: [Message!]
    message(id: Int!): Message
  }

  type Mutation {
    addMessage(text: String!): Response!
  }

  type Subscription {
    messageAdded: Message!
  }
`;
