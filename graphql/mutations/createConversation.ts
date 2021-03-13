import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const CREATE_CONVERSATION_MUTATION: DocumentNode = gql`
  mutation createConversation($multiple: Boolean, $members: [String!]) {
    createConversation(multiple: $multiple, members: $members) {
      id
      members {
        id
        name
      }
    }
  }
`;

export default CREATE_CONVERSATION_MUTATION;
