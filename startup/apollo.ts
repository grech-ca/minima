import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const cache = new InMemoryCache();

const httpLink = createHttpLink({ uri: 'http://localhost:3000/api' });

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

const link = authLink.concat(httpLink);

const client = new ApolloClient({ link, cache });

export default client;
