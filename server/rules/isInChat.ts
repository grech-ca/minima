import { AuthenticationError, ApolloError } from 'apollo-server-micro';

import ruleType from '../utils/ruleType';
import prisma from '../prisma';

import { FieldShieldResolver } from 'nexus-shield';

const isInChat = <TypeName extends string, FieldName extends string>(): FieldShieldResolver<TypeName, FieldName> =>
  ruleType<TypeName, FieldName>({
    resolve: async (_, { conversationId }, { user }) => {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { members: true },
      });

      if (!conversation) throw new ApolloError('Conversation does not exist');

      const userIsInChat = conversation.members.some(({ id }) => id === user.id);

      if (!userIsInChat) throw new AuthenticationError('Access denied');

      return true;
    },
  });

export default isInChat;
