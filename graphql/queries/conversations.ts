import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const CONVERSATIONS_QUERY: DocumentNode = gql`
  query conversations {
    conversations {
      id
      name
      multiple
      members {
        id
        name
      }
    }
  }
`;

export default CONVERSATIONS_QUERY;
