import fs from 'fs';
import { join } from 'path';

import { ApolloError } from 'apollo-server-micro';
import { objectType, queryField, nonNull, stringArg, list, inputObjectType, mutationField } from 'nexus';
import { chain } from 'nexus-shield';

import * as yup from 'yup';

import isAuthenticated from '../rules/isAuthenticated';
import isMyself from '../rules/isMyself';

import prisma from '../prisma';

import FormError from '../errors/FormError';

import validateSchema from '../utils/validateSchema';

const publicDirectory = join(process.cwd(), 'public');

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('status');
    t.string('email');
    t.string('avatarColor');
    t.string('avatarIcon');

    t.model.createdAt();

    t.list.field('conversations', {
      type: 'Conversation',
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
  resolve: async (_, __, { user }) => {
    if (!user) throw new ApolloError('Token is not provided');

    return await prisma.user.findUnique({ where: { id: user.id } });
  },
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

interface UpdateUserSchema {
  name?: string;
  avatarColor?: string;
  avatarIcon?: string;
  status?: string;
}

const updateUserSchema = yup.object().shape({
  name: yup
    .string()
    .required()
    .min(3)
    .matches(/^[a-z0-9_-]{3,16}$/)
    .test('checkIfNameTaken', 'Name is already taken', async (value: string) => {
      const user = await prisma.user.findFirst({ where: { name: { equals: value } } });

      return !user;
    }),
  avatarColor: yup
    .string()
    .matches(new RegExp('^#([0-9A-F]{3}){1,2}$', 'i'), { message: 'Color must be in hex format' }),
  avatarIcon: yup.string().test({
    name: 'checkIfIconExists',
    test: value => {
      const icons = fs.readdirSync(`${publicDirectory}/avatars`);

      // TODO: [MIN-24] Find regex for this
      const iconExists = icons.some(file => file.split('.')[0] === value);

      return iconExists;
    },
    message: 'Icon does not exist',
  }),
  status: yup.string().max(100),
});

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  definition(t) {
    t.string('name');
    t.string('status');
    t.string('avatarIcon');
    t.string('avatarColor');
  },
});

export const updateUserMutationField = mutationField('updateUser', {
  type: 'User',
  shield: chain(isAuthenticated(), isMyself()),
  args: {
    id: nonNull(stringArg()),
    data: nonNull(UpdateUserInput),
  },
  resolve: async (_, { id, data }) => {
    await validateSchema<UpdateUserSchema>(data, updateUserSchema).catch(errors => {
      throw new FormError(errors);
    });

    return await prisma.user.update({ where: { id }, data });
  },
});
