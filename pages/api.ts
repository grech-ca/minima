import path from 'path';

import { NextApiRequest, NextApiResponse } from 'next';

import { ApolloError, ApolloServer } from 'apollo-server-micro';
import { PubSub } from 'graphql-subscriptions';

import { makeSchema } from 'nexus';
import { nexusShield } from 'nexus-shield';
import { nexusPrisma } from 'nexus-plugin-prisma';
import jwt from 'jsonwebtoken';

import * as allTypes from '../server/schema';

export interface ServerContext {
  user: any;
  pubsub: PubSub;
}

type CustomSocket = Exclude<NextApiResponse<any>['socket'], null> & {
  server: Parameters<ApolloServer['installSubscriptionHandlers']>[0] & {
    apolloServer?: ApolloServer;
    apolloServerHandler?: any;
  };
};

type CustomNextApiResponse<T = any> = NextApiResponse<T> & {
  socket: CustomSocket;
};

type CustomNextApiHandler = (req: NextApiRequest, res: CustomNextApiResponse) => CustomNextApiHandler;

const schema = makeSchema({
  types: allTypes,
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
  plugins: [
    nexusShield({
      defaultError: new ApolloError('Internal Server Error'),
    }),
    nexusPrisma({ experimentalCRUD: true }),
  ],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const verifyToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET!);
  } catch {
    return null;
  }
};

const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  context: ({ req, connection }): ServerContext => {
    const user = verifyToken(connection ? connection.context.authorization : req.headers.authorization);

    return {
      user,
      pubsub,
    };
  },
  subscriptions: {
    path: '/subscriptions',
    keepAlive: 9000,
    onConnect: connectionParams => {
      console.log('Subscriptions are here');
      return connectionParams;
    },
    onDisconnect: () => console.log('Subscriptions disconnected'),
  },
  playground: {
    subscriptionEndpoint: '/subscriptions',
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});

const graphqlWithSubscriptionHandler: CustomNextApiHandler = (req: NextApiRequest, res: CustomNextApiResponse) => {
  const oldOne = res.socket.server.apolloServer;
  if (oldOne && oldOne !== server) {
    delete res.socket.server.apolloServer;
  }

  if (!res.socket.server.apolloServer) {
    server.installSubscriptionHandlers(res.socket.server);
    res.socket.server.apolloServer = server;
    const handler = server.createHandler({ path: '/api' });
    res.socket.server.apolloServerHandler = handler;

    void oldOne?.stop();
  }

  const nextApiHandler = res.socket.server.apolloServerHandler(req, res) as CustomNextApiHandler;

  return nextApiHandler;
};

export default graphqlWithSubscriptionHandler;
