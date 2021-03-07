import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const EMAIL_EXISTS_QUERY: DocumentNode = gql`
  query emailExists($email: String!) {
    emailExists(email: $email)
  }
`;

export default EMAIL_EXISTS_QUERY;
