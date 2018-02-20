import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../utils';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import locales from '../../locales';

class Home extends Component {
  componentDidMount() {
    this.props.data.refetch();
  }

  render() {
    const { data: { loading, users, currentUser } } = this.props;
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
            return <p key={user.id}>{user.email}</p>;
          })}
        {!loading &&
          currentUser && (
            <p>
              ID: {currentUser.id} {locales.home.email}: {currentUser.email}
            </p>
          )}
        {!loading && !users && <p>The server may be offline</p>}
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
    currentUser {
      id
      email
    }
  }
`;

export default withApollo(
  graphql(usersQuery)(connect(mapStateToProps, mapDispatchToProps)(Home))
);
