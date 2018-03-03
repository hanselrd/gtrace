import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import locales from '../../locales';

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
        <p>
          {locales.userId}: {user.id}
        </p>
        <p>
          {locales.name}: {user.name}
        </p>
        <p>
          {locales.email}: {user.email}
        </p>
        <p>
          {locales.language}:{' '}
          {user.language === 'en'
            ? locales.english
            : user.language === 'es' ? locales.spanish : null}
        </p>
        <p>
          {locales.online}: {user.online ? locales.yes : locales.no}
        </p>
        <div>
          {locales.role}:{' '}
          {user.role && (
            <Label key={user.role.id} color={user.role.color}>
              {user.role.abbreviation}
            </Label>
          )}
        </div>
        <p>
          {locales.joined}:{' '}
          {joined.toLocaleString(locales.getLanguage(), options)}
        </p>
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
