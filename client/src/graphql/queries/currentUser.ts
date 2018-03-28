import { ChildDataProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  query {
    currentUser {
      id
      name
    }
  }
`;

export type CurrentUserQueryData = {
  currentUser: {
    id: string;
    name: string;
  };
};

export type CurrentUserQueryProps = ChildDataProps<{}, CurrentUserQueryData>;
