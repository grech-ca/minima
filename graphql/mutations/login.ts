import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const LOGIN_MUTATION: DocumentNode = gql`
  mutation login($login: String!, $password: String!) {
    signin(nameOrEmail: $login, password: $password) {
      authToken
    }
  }
`;

export default LOGIN_MUTATION;
