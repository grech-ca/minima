import { objectType, list, nonNull, stringArg, queryField, mutationField, inputObjectType } from 'nexus';

import slugify from 'slugify';
import shortid from 'shortid';

import prisma from '../../lib/prisma';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.string('id');

    t.string('title');
    t.string('slug');
    t.string('content');

    t.field('author', {
      type: 'User',
      resolve: async ({ id }) => await prisma.post.findUnique({ where: { id } }).author(),
    });

    t.list.field('likedBy', {
      type: 'User',
      resolve: async ({ id }) =>
        await prisma.post
          .findUnique({
            where: { id },
          })
          .likedBy(),
    });

    t.list.field('savedBy', {
      type: 'User',
      resolve: async ({ id }) =>
        await prisma.post
          .findUnique({
            where: { id },
          })
          .savedBy(),
    });

    t.list.field('comments', {
      type: list('Comment'),
      resolve: async ({ id }) => await prisma.post.findUnique({ where: { id } }).comments(),
    });
  },
});

export const postsQueryField = queryField('posts', {
  type: list(nonNull('Post')),
  resolve: () => prisma.post.findMany(),
});

export const postQueryField = queryField('post', {
  type: 'Post',
  args: { id: nonNull(stringArg()) },
  resolve: async (_, { id }) => await prisma.post.findUnique({ where: { id } }),
});

export const CreatePostInput = inputObjectType({
  name: 'CreatePostInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('content');
  },
});

export const createPostMutationField = mutationField('createPost', {
  type: 'Post',
  args: {
    data: 'CreatePostInput',
  },
  resolve: async (_, { data }, { user }) => {
    const generatedSlug = slugify(data.title, {
      lower: true,
    });

    const generatedId: string = shortid.generate();

    const slug = `${generatedSlug}-${generatedId}`;

    return await prisma.post.create({
      data: {
        ...data,
        slug,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  },
});
