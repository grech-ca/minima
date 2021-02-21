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
