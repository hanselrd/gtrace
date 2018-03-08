import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
// import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom';

let httpLink = null;

export let wsClient = null;

const wsClientOptions = {
  reconnect: true,
  connectionParams: () => ({
    authorization: localStorage.getItem(
      process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY
    )
  })
};

if (process.env.NODE_ENV === 'development') {
  httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
  });

  wsClient = new SubscriptionClient(
    'ws://localhost:4000/graphql',
    wsClientOptions
  );
} else if (process.env.NODE_ENV === 'production') {
  httpLink = new HttpLink({
    uri: 'https://traceapp.herokuapp.com/graphql'
  });

  wsClient = new SubscriptionClient(
    'wss://traceapp.herokuapp.com/graphql',
    wsClientOptions
  );
}

const wsLink = new WebSocketLink(wsClient);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem(
        process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY
      )
    }
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
// registerServiceWorker();
