import { ApolloError } from 'apollo-server';
import { withFilter } from 'graphql-subscriptions';

import { objectType, queryField, nonNull, stringArg, mutationField, booleanArg, list, subscriptionField } from 'nexus';
import { chain } from 'nexus-shield';

import { ServerContext } from 'pages/api';

import prisma from '../prisma';

import isAuthenticated from '../rules/isAuthenticated';
import isInChat from '../rules/isInChat';

import { NexusGenFieldTypes } from 'pages/api/nexus-typegen';

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
  shield: chain(isAuthenticated(), isInChat()),
  resolve: async (_, { conversationId }) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { members: true },
    });

    return conversation;
  },
});

export const conversationsQueryField = queryField('conversations', {
  type: list('Conversation'),
  shield: isAuthenticated(),
  resolve: async (_, __, { user }) => {
    const conversations = await prisma.user.findUnique({ where: { id: user.id } }).conversations();

    return conversations;
  },
});

export const createConversationMutationField = mutationField('createConversation', {
  type: 'Conversation',
  args: { personal: booleanArg(), users: list(nonNull(stringArg())) },
  shield: isAuthenticated(),
  resolve: async (_, { personal = true, users }, { user }) => {
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
  shield: chain(isAuthenticated(), isInChat()),
  resolve: async (_, { content, conversationId }, { user, pubsub }) => {
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

    pubsub.publish('sendMessage', {
      ...message,
    });

    return message;
  },
});

export const conversationSubscriptionField = subscriptionField('conversationMessages', {
  type: 'Message',
  args: { conversationId: nonNull(stringArg()) },
  shield: chain(isAuthenticated(), isInChat()),
  subscribe: withFilter(
    (_, __, { pubsub }: ServerContext) => pubsub.asyncIterator('sendMessage'),
    async (_, { conversationId }, { user }) => {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { members: true },
      });

      const access = conversation.members.some(({ id }) => id === user.id);

      return access;
    },
  ),
  resolve: (payload: NexusGenFieldTypes['Conversation']) => payload,
});
