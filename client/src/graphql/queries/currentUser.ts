import { ChildDataProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  query {
    currentUser {
      id
      name
      friends {
        id
      }
      pendingFriends {
        id
      }
    }
  }
`;

export type CurrentUserQueryData = {
  currentUser: {
    id: string;
    name: string;
    friends: [
      {
        id: string;
      }
    ];
    pendingFriends: [
      {
        id: string;
      }
    ];
  };
};

export type CurrentUserQueryProps = ChildDataProps<{}, CurrentUserQueryData>;
