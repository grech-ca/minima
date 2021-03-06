import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const MESSAGES_QUERY: DocumentNode = gql`
  query messages($id: String!) {
    messages(conversationId: $id) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

export default MESSAGES_QUERY;
