export default `
  type Message {
    id: ID!
    text: String!
    user: User!
    createdAt: DateTime!
  }

  type Query {
    messages: [Message!]
    message(id: Int!): Message
  }

  type Mutation {
    addMessage(text: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;
