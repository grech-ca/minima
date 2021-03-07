import { objectType, queryField, nonNull, stringArg, list } from 'nexus';
import { chain } from 'nexus-shield';

import prisma from '../../lib/prisma';

import isAuthenticated from '../rules/isAuthenticated';
import isMyself from '../rules/isMyself';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('email');

    t.list.field('conversations', {
      type: 'Conversation',
      shield: chain(isAuthenticated(), isMyself()),
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
  resolve: async (_, __, { user }) => await prisma.user.findUnique({ where: { id: user.id } }), // check for token
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
