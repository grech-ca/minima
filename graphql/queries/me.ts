import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const ME_QUERY: DocumentNode = gql`
  query me {
    me {
      id
      name
    }
  }
`;

export default ME_QUERY;
