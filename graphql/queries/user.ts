import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const USER_QUERY: DocumentNode = gql`
  query user($id: String!) {
    user(userId: $id) {
      id
      name
      status
      email
      avatarColor
      avatarIcon
      createdAt
    }
  }
`;

export default USER_QUERY;
