import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

type Data = {
  login: {
    token: string;
  };
};

type Variables = {
  email: string;
  password: string;
};

export type LoginMutationProps = ChildProps<{}, Data, Variables>;
