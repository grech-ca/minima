import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const REGISTER_MUTATION: DocumentNode = gql`
  mutation register($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      authToken
    }
  }
`;

export default REGISTER_MUTATION;
