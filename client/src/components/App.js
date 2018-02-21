import React, { Component } from 'react';
import '../styles/App.css';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../utils';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Routes from './Routes';
import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.authStart();
    this.props.localeStart();
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
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
          {auth &&
            currentUser && (
              <li>
                <NavLink to={'/profile/' + currentUser.id}>Profile</NavLink>
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

export const currentUserQuery = gql`
  query {
    currentUser {
      id
    }
  }
`;

export default withRouter(
  graphql(currentUserQuery, {
    options: { pollInterval: 5000 }
  })(connect(mapStateToProps, mapDispatchToProps)(App))
);
