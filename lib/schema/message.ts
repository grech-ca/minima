import { objectType } from 'nexus';

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

// export const sendMessageSubscriptionField = subscriptionField('message', {

// })
