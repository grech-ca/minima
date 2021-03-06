import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const cache = new InMemoryCache();

const link = createHttpLink({
  uri: 'http://localhost:3000/api',
  headers: {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbHZidThhMjAwMjZsbm1lbzc5bWM5NDgiLCJpYXQiOjE2MTQ4OTAyNjF9.TuYBxtbrH5PVDmWPDtmHyBYtiY5RQnCfK-c7oJRMqco',
  },
});

const client = new ApolloClient({ link, cache });

export default client;
