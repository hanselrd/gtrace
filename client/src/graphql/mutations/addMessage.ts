import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation($text: String!) {
    addMessage(text: $text) {
      id
    }
  }
`;

export type AddMessageMutationData = {
  addMessage: {
    id: string;
  };
};

export type AddMessageMutationVariables = {
  text: string;
};

export type AddMessageMutationProps = ChildProps<
  {},
  AddMessageMutationData,
  AddMessageMutationVariables
>;
