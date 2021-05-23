import fs from 'fs';
import { join } from 'path';

import { ApolloError } from 'apollo-server-micro';

import { objectType, nonNull, stringArg, mutationField } from 'nexus';

import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import prisma from '../prisma';

import FormError from '../errors/FormError';

import validateSchema from '../utils/validateSchema';

interface SignupSchema {
  username: string;
  email: string;
  password: string;
}

const publicDirectory = join(process.cwd(), 'public');

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(3)
    .matches(/^[a-z0-9_-]{3,16}$/)
    .test('checkIfNameTaken', 'Name is already taken', async (value: string) => {
      const user = await prisma.user.findFirst({ where: { name: { equals: value } } });

      return !user;
    }),
  email: yup
    .string()
    .email()
    .test('checkIfEmailTaken', 'Email is already taken', async (value: string) => {
      const user = await prisma.user.findFirst({ where: { email: { equals: value } } });

      return !user;
    }),
  password: yup.string().min(5),
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
});

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('authToken');
  },
});

export const signupMutationField = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    username: nonNull(stringArg()),
    password: nonNull(stringArg()),
    email: nonNull(stringArg()),
    avatarIcon: nonNull(stringArg()),
    avatarColor: nonNull(stringArg()),
  },
  resolve: async (_, args) => {
    await validateSchema<SignupSchema>(args, signupSchema).catch(errors => {
      throw new FormError(errors);
    });

    const { password, username, ...rest } = args;

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
        ...rest,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.SECRET!);

    return {
      authToken: token,
    };
  },
});

export const signinQueryField = mutationField('signin', {
  type: 'AuthPayload',
  args: {
    password: nonNull(stringArg()),
    nameOrEmail: nonNull(stringArg()),
  },
  resolve: async (_, { password, nameOrEmail }) => {
    const isEmail = await yup.string().email().isValid(nameOrEmail);

    const user = await prisma.user.findUnique({
      where: { ...(isEmail ? { email: nameOrEmail } : { name: nameOrEmail }) },
    });

    if (!user) {
      throw new ApolloError('User does not exist');
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new ApolloError('Password is incorrect');
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET!);

    return {
      authToken: token,
    };
  },
});
