import gql from 'graphql-tag';

export default gql`
  subscription {
    messageAdded {
      id
      text
      user {
        id
        name
        role {
          abbreviation
          color
        }
      }
      createdAt
    }
  }
`;

export type MessageAddedSubscriptionData = {
  messageAdded: {
    id: string;
    text: string;
    user: {
      id: string;
      name: string;
      role: {
        abbreviation: string;
        color: string;
      };
    };
    createdAt: string;
  };
};
