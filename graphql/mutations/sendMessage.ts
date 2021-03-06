import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const SEND_MESSAGE_MUTATION: DocumentNode = gql`
  mutation sendMessage($id: String!, $content: String!) {
    sendMessage(conversationId: $id, content: $content) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

export default SEND_MESSAGE_MUTATION;
