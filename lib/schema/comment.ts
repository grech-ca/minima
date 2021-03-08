import { objectType, mutationField, inputObjectType } from 'nexus';

import prisma from '../prisma';

import isAuthenticated from '../rules/isAuthenticated';

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.string('id');

    t.string('content');

    t.field('author', {
      type: 'User',
      resolve: async ({ id }) => await prisma.comment.findUnique({ where: { id } }).author(),
    });

    t.field('post', {
      type: 'Post',
      resolve: async ({ id }) => await prisma.comment.findUnique({ where: { id } }).post(),
    });

    t.field('replyTo', {
      type: 'Comment',
      resolve: async ({ id }) => await prisma.comment.findUnique({ where: { id } }).replyTo(),
    });
  },
});

export const CreateCommentInput = inputObjectType({
  name: 'CreateCommentInput',
  definition(t) {
    t.nonNull.string('content');

    t.nonNull.string('postId');
    t.string('replyToId');
  },
});

export const createCommentMutationField = mutationField('createComment', {
  type: 'Comment',
  args: { data: CreateCommentInput },
  shield: isAuthenticated(),
  resolve: async (_, { data: { content, postId, replyToId } }, { user }) =>
    await prisma.comment.create({
      data: {
        content,
        ...(replyToId
          ? {
              replyTo: {
                connect: {
                  id: replyToId,
                },
              },
            }
          : {}),
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
});
