import { withFilter } from 'graphql-subscriptions';

import { objectType, queryField, nonNull, stringArg, mutationField, booleanArg, list, subscriptionField } from 'nexus';
import { chain } from 'nexus-shield';

import * as yup from 'yup';

import { ServerContext } from 'pages/api';

import prisma from '../prisma';

import isAuthenticated from '../rules/isAuthenticated';
import isInChat from '../rules/isInChat';

import validateSchema from '../utils/validateSchema';

import FormError from '../errors/FormError';

import { NexusGenFieldTypes } from 'pages/api/nexus-typegen';

interface ConversationSchema {
  multiple?: boolean;
  users?: string[];
}

export const Conversation = objectType({
  name: 'Conversation',
  definition(t) {
    t.string('id');

    t.string('name');

    t.boolean('multiple');

    t.model.createdAt();

    t.field('createdBy', {
      type: 'User',
      resolve: async ({ id }) => await prisma.conversation.findUnique({ where: { id } }).createdBy(),
    });

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
  args: { name: stringArg(), multiple: booleanArg({ default: false }), members: list(nonNull(stringArg())) },
  shield: isAuthenticated(),
  resolve: async (_, { multiple, members, name }, { user }) => {
    const args = {
      multiple,
      members: members.filter(id => id !== user.id),
    };

    const conversationSchema = yup.object().shape({
      multiple: yup.boolean(),
      members: yup
        .array()
        .of(yup.string())
        .min(1)
        .when('multiple', {
          is: false,
          then: schema =>
            schema.max(1).test({
              name: 'isPersonalChatExists',
              test: async membersIds => {
                const chat = await prisma.conversation.findFirst({
                  where: {
                    AND: [{ multiple: false }, { members: { every: { id: { in: [...membersIds, user.id] } } } }],
                  },
                });

                return chat === null;
              },
              message: 'You already have a personal chat with this person',
            }),
        }),
      name: yup.string().when('multiple', {
        is: false,
        then: schema =>
          schema.test({
            name: 'nameIsProvided',
            test: name => name === undefined,
            message: 'You cannot set name to the personal conversation.',
          }),
      }),
    });

    await validateSchema<ConversationSchema>(args, conversationSchema).catch(errors => {
      throw new FormError(errors);
    });

    const mappedUsers = [user.id, ...members].map(id => ({ id }));

    const conversation = await prisma.conversation.create({
      data: {
        name,
        multiple,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
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
