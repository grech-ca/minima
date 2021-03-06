import { FC } from 'react';
import { AppProps } from 'next/app';

import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';

import store from 'startup/redux';
import client from 'startup/apollo';

import 'tailwindcss/tailwind.css';
import 'styles/index.scss';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
};

export default MyApp;
