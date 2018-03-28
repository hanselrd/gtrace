import { ChildDataProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  query {
    messages {
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

export type MessagesQueryData = {
  messages: [
    {
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
    }
  ];
};

export type MessagesQueryProps = ChildDataProps<{}, MessagesQueryData>;
