import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export type LoginMutationData = {
  login: {
    token: string;
  };
};

export type LoginMutationVariables = {
  email: string;
  password: string;
};

export type LoginMutationProps = ChildProps<
  {},
  LoginMutationData,
  LoginMutationVariables
>;
