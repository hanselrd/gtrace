import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../utils';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
// import locales from '../../locales';

class Home extends Component {
  render() {
    const { data: { loading, users } } = this.props;
    return (
      <div className="Home">
        <Button
          color="red"
          onClick={() => {
            this.props.authUnsetToken();
            this.props.client.resetStore();
          }}
        >
          Logout
        </Button>
        {loading && <p>Loading...</p>}
        {!loading &&
          users &&
          users.map(user => {
            return (
              <p key={user.id}>
                <NavLink to={'/profile/' + user.id}>{user.email}</NavLink>
              </p>
            );
          })}
      </div>
    );
  }
}

const usersQuery = gql`
  query {
    users {
      id
      email
    }
  }
`;

export default withApollo(
  graphql(usersQuery, {
    options: { pollInterval: 5000 }
  })(connect(mapStateToProps, mapDispatchToProps)(Home))
);
