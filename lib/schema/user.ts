import { ApolloError } from 'apollo-server-micro';
import { objectType, queryField, nonNull, stringArg, list } from 'nexus';

import prisma from '../../lib/prisma';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('email');

    t.list.field('conversations', {
      type: 'Conversation',
      resolve: ({ id }) =>
        prisma.user
          .findUnique({
            where: { id },
          })
          .conversations(),
    });
  },
});

export const meQueryField = queryField('me', {
  type: 'User',
  resolve: async (_, __, { user }) => {
    if (!user) throw new ApolloError('Token is not provided');

    return await prisma.user.findUnique({ where: { id: user.id } });
  },
});

export const userQueryField = queryField('user', {
  type: 'User',
  args: {
    userId: nonNull(stringArg()),
  },
  resolve: (_, { userId }) =>
    prisma.user.findUnique({
      where: { id: userId },
    }),
});

export const usersQueryField = queryField('users', {
  type: list(nonNull('User')),
  resolve: () => prisma.user.findMany({ where: {} }),
});

export const nameExistsQueryField = queryField('nameExists', {
  type: 'Boolean',
  args: { name: nonNull(stringArg()) },
  resolve: async (_, { name }) => {
    const user = await prisma.user.findFirst({ where: { name: { equals: name } } });

    return Boolean(user);
  },
});

export const emailExistsQueryField = queryField('emailExists', {
  type: 'Boolean',
  args: { email: nonNull(stringArg()) },
  resolve: async (_, { email }) => {
    const user = await prisma.user.findFirst({ where: { email: { equals: email } } });
    console.log(user);

    return Boolean(user);
  },
});
