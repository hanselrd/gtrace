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
      }
      createdAt
    }
  }
`;

export type MessagesQueryData = {
  messages: {
    id: string;
    text: string;
    user: {
      id: string;
      name: string;
    };
    createdAt: string;
  };
};

export type MessagesQueryProps = ChildDataProps<{}, MessagesQueryData>;
