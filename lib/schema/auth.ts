import { ApolloError } from 'apollo-server-micro';

import { objectType, nonNull, stringArg, mutationField } from 'nexus';

import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import prisma from '../../lib/prisma';

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(3)
    .matches(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
  email: yup.string().email(),
  password: yup.string().min(5),
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
  },
  resolve: async (_, args) => {
    await signupSchema.validate(args).catch(err => {
      throw new ApolloError(err);
    });

    const { password, username, email } = args;

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
        email,
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
