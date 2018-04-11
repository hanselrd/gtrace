import { ChildDataProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  query($id: ID!) {
    user(id: $id) {
      id
      name
      email
      dob
      language
      online
      role {
        id
        abbreviation
        color
      }
      friends {
        id
        name
      }
      pendingFriends {
        id
        name
      }
      createdAt
    }
  }
`;

export type UserQueryData = {
  user: {
    id: string;
    name: string;
    email: string;
    dob: string;
    language: string;
    online: boolean;
    role: {
      id: string;
      abbreviation: string;
      color: string;
    };
    friends: {
      id: string;
      name: string;
    };
    pendingFriends: {
      id: string;
      name: string;
    };
    createdAt: string;
  };
};

export type UserQueryVariables = {
  id: string;
};

export type UserQueryProps = ChildDataProps<
  {},
  UserQueryData,
  UserQueryVariables
>;
