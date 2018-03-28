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
