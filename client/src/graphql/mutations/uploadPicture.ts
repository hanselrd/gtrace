import { ChildProps } from 'react-apollo';
import gql from 'graphql-tag';

export default gql`
  mutation($data: String!) {
    uploadPicture(data: $data)
  }
`;

export type UploadPictureMutationData = {
  uploadPicture: string;
};

export type UploadPictureMutationVariables = {
  data: string;
};

export type UploadPictureMutationProps = ChildProps<
  {},
  UploadPictureMutationData,
  UploadPictureMutationVariables
>;
