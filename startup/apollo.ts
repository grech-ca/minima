import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

const cache = new InMemoryCache();

const httpLink = createHttpLink({ uri: 'http://localhost:3000/api' });

const wsLink = process.browser
  ? new WebSocketLink({
      uri: 'ws://localhost:3000/subscriptions',
      options: {
        reconnect: true,
        connectionParams: () => ({
          authorization: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '',
        }),
      },
    })
  : null;

const authLink = setContext((_, { headers }) => {
  if (typeof localStorage === 'undefined') return;

  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const splitLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
    )
  : httpLink;

const link = authLink.concat(splitLink);

const client = new ApolloClient({ ssrMode: true, link, cache });

export default client;
