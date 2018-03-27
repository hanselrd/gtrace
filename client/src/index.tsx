import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as apollo from '@app/core/apollo';
import store from '@app/core/store';

ReactDOM.render(
  <ApolloProvider client={apollo.client}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
// registerServiceWorker();
