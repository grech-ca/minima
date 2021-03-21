import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const CREATE_CONVERSATION_MUTATION: DocumentNode = gql`
  mutation createConversation($multiple: Boolean, $members: [String!], $name: String) {
    createConversation(multiple: $multiple, members: $members, name: $name) {
      id
      name
      members {
        id
        name
      }
    }
  }
`;

export default CREATE_CONVERSATION_MUTATION;
