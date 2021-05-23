import { ApolloError } from 'apollo-server-micro';

import ruleType from '../utils/ruleType';

import { FieldShieldResolver } from 'nexus-shield';

const isMyself = <TypeName extends string, FieldName extends string>(): FieldShieldResolver<TypeName, FieldName> =>
  ruleType<TypeName, FieldName>({
    resolve: (_, { id }, { user }) => {
      if (id !== user.id) throw new ApolloError('Access denied');

      return true;
    },
  });

export default isMyself;
