import React, { Component } from 'react';
import '../styles/App.css';
import { NavLink, withRouter } from 'react-router-dom';
import { withRedux } from '../utils';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Aux from 'react-aux';
import Routes from './Routes';
import Footer from './Footer';

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
    const { auth, data: { currentUser } } = this.props;
    return (
      <div className="App">
        <ul>
          {auth && (
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
          )}
          {!auth && (
            <Aux>
              <li>
                <NavLink to="/login">Log in</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Sign up</NavLink>
              </li>
            </Aux>
          )}
          {auth &&
            currentUser && (
              <li>
                <NavLink to={'/profile/' + currentUser.id}>
                  {currentUser.name}
                </NavLink>
              </li>
            )}
        </ul>
        <hr />
        <Routes />
        <hr />
        <Footer />
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
