import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation($id: ID!) {
    sendFriendRequest(id: $id)
  }
`;

export type SendFriendRequestMutationData = {
  sendFriendRequest: boolean;
};

export type SendFriendRequestMutationVariables = {
  id: string;
};

export type SendFriendRequestMutationProps = ChildProps<
  {},
  SendFriendRequestMutationData,
  SendFriendRequestMutationVariables
>;
