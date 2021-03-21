import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const MESSAGES_SUBSCRIPTION: DocumentNode = gql`
  subscription messagesSub($id: String!) {
    conversationMessages(conversationId: $id) {
      id
      content
      createdAt
      author {
        id
        name
        avatarIcon
        avatarColor
      }
    }
  }
`;

export default MESSAGES_SUBSCRIPTION;
