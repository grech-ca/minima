import { AuthenticationError } from 'apollo-server-micro';

import ruleType from '../utils/ruleType';
import prisma from '../prisma';

import { FieldShieldResolver } from 'nexus-shield';

const isAuthenticated = <TypeName extends string, FieldName extends string>(): FieldShieldResolver<
  TypeName,
  FieldName
> =>
  ruleType<TypeName, FieldName>({
    resolve: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Unauthorized');

      const target = await prisma.user.findUnique({ where: { id: user.id } });

      if (!target) throw new AuthenticationError('User does not exist');

      return true;
    },
  });

export default isAuthenticated;
