import { ApolloError } from 'apollo-server';
import { objectType, queryField, nonNull, stringArg, mutationField, booleanArg, list } from 'nexus';

import prisma from '../../lib/prisma';

export const Conversation = objectType({
  name: 'Conversation',
  definition(t) {
    t.string('id');

    t.boolean('personal');

    t.list.field('members', {
      type: 'User',
      resolve: ({ id }) =>
        prisma.conversation
          .findUnique({
            where: { id },
          })
          .members(),
    });

    t.list.field('messages', {
      type: 'Message',
      resolve: ({ id }) =>
        prisma.conversation
          .findUnique({
            where: { id },
          })
          .messages(),
    });
  },
});

export const conversationQueryField = queryField('conversation', {
  type: 'Conversation',
  args: {
    conversationId: nonNull(stringArg()),
  },
  resolve: (_, { conversationId }, { user }) => {
    const conversation = prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { members: true },
    });

    const userInConversation = conversation.members.some(({ id }) => id === user.id);

    if (!userInConversation) throw new ApolloError('Access denied');

    return conversation;
  },
});

export const createConversationMutationField = mutationField('createConversation', {
  type: 'Conversation',
  args: { personal: booleanArg(), users: list(nonNull(stringArg())) },
  resolve: async (_, { personal = true, users }, { user }) => {
    if (!user) throw new ApolloError('Not authorized');

    if (!users.length) throw new ApolloError('No users provided');
    if (personal && users.length > 1) throw new ApolloError('Personal conversation must have only 2 users');
    if (!personal && users.length < 1) throw new ApolloError('Chat must have at least 2 users');

    const mappedUsers = [user.id, ...users].map(id => ({ id }));

    const conversation = await prisma.conversation.create({
      data: {
        personal,
        messages: {
          connect: [],
        },
        members: {
          connect: mappedUsers,
        },
      },
    });

    return conversation;
  },
});

export const sendMessageMutationField = mutationField('sendMessage', {
  type: 'Message',
  args: {
    conversationId: nonNull(stringArg()),
    content: nonNull(stringArg()),
  },
  resolve: async (_, { content, conversationId }, { user }) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { members: true },
    });

    const userInConversation = conversation.members.some(({ id }) => id === user.id);

    if (!userInConversation) throw new ApolloError('Access denied');

    const message = await prisma.message.create({
      data: {
        author: {
          connect: { id: user.id },
        },
        content,
        conversation: {
          connect: { id: conversationId },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          connect: [{ id: message.id }],
        },
      },
    });

    return message;
  },
});
