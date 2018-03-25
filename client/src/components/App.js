import React, { Component } from 'react';
import './App.css';
import { Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withRedux } from '../utils';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Routes from './Routes';
import Header from './Header';
// import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.authStart();
    this.props.localeStart();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.currentUser && !this.props.data.currentUser) {
      const { language } = nextProps.data.currentUser;
      this.props.localeChange(language);
    }
  }

  render() {
    const { data: { currentUser } } = this.props;
    return (
      <div className="App">
        <Header user={currentUser} />
        <Container text className="App-container">
          <Routes />
        </Container>
        {/* <Footer /> */}
      </div>
    );
  }
}

const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      name
      language
    }
  }
`;

export default compose(
  withRouter,
  graphql(CURRENT_USER_QUERY, { options: { errorPolicy: 'all' } }),
  withRedux
)(App);
