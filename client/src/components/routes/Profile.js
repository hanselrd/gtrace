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
          {locales.dob}:{' '}
          {new Date(user.dob).toLocaleString(locales.getLanguage(), options)}
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
          {new Date(user.createdAt).toLocaleString(
            locales.getLanguage(),
            options
          )}
        </p>
      </div>
    );
  }
}

const USER_BY_ID_QUERY = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      name
      email
      dob
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

export default graphql(USER_BY_ID_QUERY, {
  options: ({ match }) => ({
    variables: { id: match.params.id }
  })
})(Profile);
