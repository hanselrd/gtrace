import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation($id: ID!, $accept: Boolean!) {
    handleFriendRequest(id: $id, accept: $accept)
  }
`;

export type HandleFriendRequestMutationData = {
  handleFriendRequest: boolean;
};

export type HandleFriendRequestMutationVariables = {
  id: string;
  accept: boolean;
};

export type HandleFriendRequestMutationProps = ChildProps<
  {},
  HandleFriendRequestMutationData,
  HandleFriendRequestMutationVariables
>;
