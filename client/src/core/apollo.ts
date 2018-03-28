import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { OperationDefinitionNode } from 'graphql';
import { authServices } from '@app/ducks/auth';

let httpLink: HttpLink;

export let subscriptionClient: SubscriptionClient;

const subscriptionClientOptions = {
  reconnect: true,
  connectionParams: () => ({
    authorization: authServices.getAuthToken()
  })
};

if (process.env.NODE_ENV !== 'production') {
  httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
  });

  subscriptionClient = new SubscriptionClient(
    'ws://localhost:4000/graphql',
    subscriptionClientOptions
  );
} else {
  httpLink = new HttpLink({
    uri: 'https://traceapp.herokuapp.com/graphql'
  });

  subscriptionClient = new SubscriptionClient(
    'wss://traceapp.herokuapp.com/graphql',
    subscriptionClientOptions
  );
}

const wsLink = new WebSocketLink(subscriptionClient);

const link = split(
  ({ query }) => {
    const { kind, operation } = <OperationDefinitionNode>getMainDefinition(
      query
    );
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: authServices.getAuthToken()
  }
}));

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});
