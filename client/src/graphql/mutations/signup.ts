import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation(
    $name: String!
    $email: String!
    $password: String!
    $dob: DateTime!
    $language: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      dob: $dob
      language: $language
    ) {
      token
    }
  }
`;

export type SignupMutationData = {
  signup: {
    token: string;
  };
};

export type SignupMutationVariables = {
  name: string;
  email: string;
  password: string;
  dob: string;
  language: string;
};

export type SignupMutationProps = ChildProps<
  {},
  SignupMutationData,
  SignupMutationVariables
>;
