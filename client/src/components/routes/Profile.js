import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Profile extends Component {
  componentWillMount() {
    this.props.data.refetch();
  }

  render() {
    const { data: { loading, user } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return <p>No user found</p>;
    }

    const joined = new Date(user.createdAt);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };

    return (
      <div className="Profile">
        <p>User ID: {user.id}</p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>
          Language:{' '}
          {user.language === 'en'
            ? 'English'
            : user.language === 'es' ? 'Spanish' : null}
        </p>
        <p>Online: {user.online ? 'Yes' : 'No'}</p>
        <div>
          Role:{' '}
          {user.role && (
            <Label key={user.role.id} color={user.role.color}>
              {user.role.abbreviation}
            </Label>
          )}
        </div>
        <p>Joined: {joined.toLocaleString('en-US', options)}</p>
      </div>
    );
  }
}

const userByIdQuery = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      name
      email
      language
      online
      role {
        id
        abbreviation
        color
      }
      createdAt
    }
  }
`;

export default graphql(userByIdQuery, {
  options: ({ match }) => ({
    variables: { id: match.params.id }
  })
})(Profile);
