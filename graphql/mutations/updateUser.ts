import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const UPDATE_USER_MUTATION: DocumentNode = gql`
  mutation updateUser($id: String!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      name
      status
      avatarIcon
      avatarColor
    }
  }
`;

export default UPDATE_USER_MUTATION;
