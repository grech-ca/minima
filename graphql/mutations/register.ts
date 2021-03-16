import { gql } from '@apollo/client';

import { DocumentNode } from 'graphql';

const REGISTER_MUTATION: DocumentNode = gql`
  mutation register(
    $email: String!
    $username: String!
    $password: String!
    $avatarColor: String!
    $avatarIcon: String!
  ) {
    signup(
      email: $email
      username: $username
      password: $password
      avatarColor: $avatarColor
      avatarIcon: $avatarIcon
    ) {
      authToken
    }
  }
`;

export default REGISTER_MUTATION;
