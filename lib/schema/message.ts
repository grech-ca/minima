import { nonNull, objectType, stringArg, queryField, list } from 'nexus';

import prisma from '../../lib/prisma';

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
  resolve: async (_, { conversationId }) =>
    await prisma.message.findMany({ where: { conversation: { id: conversationId } } }),
});
