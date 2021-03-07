import { ApolloError } from 'apollo-server-micro';

import { objectType, nonNull, stringArg, mutationField } from 'nexus';

import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import prisma from '../../lib/prisma';

export interface FormErrors {
  [key: string]: string;
}

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
    await signupSchema.validate(args, { abortEarly: false }).catch(errors => {
      const schemaErrors: FormErrors = errors.inner.reduce((errorsObject: FormErrors, { path, message }: any) => {
        return { ...errorsObject, [path]: message };
      }, {});

      throw new ApolloError('Validation Failed', 'VALIDATION_SCHEMA_ERROR', { validationErrors: schemaErrors });
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
