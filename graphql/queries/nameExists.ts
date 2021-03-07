import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const NAME_EXISTS_QUERY: DocumentNode = gql`
  query nameExists($name: String!) {
    nameExists(name: $name)
  }
`;

export default NAME_EXISTS_QUERY;
