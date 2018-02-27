import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Profile extends Component {
  componentWillMount() {
    this.props.data.refetch();
  }

  render() {
    const { data: { loading, error, user } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error.message}</p>;
    }

    if (!user) {
      return <p>No user found</p>;
    }

    return (
      <div className="Profile">
        <p>User ID: {user.id}</p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Language: {user.language}</p>
      </div>
    );
  }
}

const userByIdQuery = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      email
      name
      language
    }
  }
`;

export default graphql(userByIdQuery, {
  options: ({ match }) => ({
    variables: { id: match.params.id }
  })
})(Profile);
