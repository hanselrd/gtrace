import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Home extends Component {
  render() {
    const { data: { loading, users } } = this.props;
    return (
      <div className="Home">
        {loading && <p>Loading...</p>}
        {!loading &&
          users &&
          users.map(user => {
            return <p key={user.id}>{user.email}</p>;
          })}
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
  }
`;

export default graphql(usersQuery)(Home);
