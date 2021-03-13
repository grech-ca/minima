import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const USERS_QUERY: DocumentNode = gql`
  query users {
    users {
      id
      name
      email
    }
  }
`;

export default USERS_QUERY;
