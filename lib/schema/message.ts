import { nonNull, objectType, stringArg, queryField, list } from 'nexus';

import { chain } from 'nexus-shield';

import prisma from '../prisma';

import isAuthenticated from '../rules/isAuthenticated';
import isInChat from '../rules/isInChat';

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.string('id');
    t.string('content');

    t.field('author', {
      type: 'User',
      resolve: ({ id }) =>
        prisma.message
          .findUnique({
            where: { id },
          })
          .author(),
    });
  },
});

export const messagesQueryField = queryField('messages', {
  type: list('Message'),
  args: {
    conversationId: nonNull(stringArg()),
  },
  shield: chain(isAuthenticated(), isInChat()),
  resolve: async (_, { conversationId }) =>
    await prisma.message.findMany({ where: { conversation: { id: conversationId } } }),
});
