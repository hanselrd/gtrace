import React, { Component } from 'react';
import { Grid, Label } from 'semantic-ui-react';
import Aux from 'react-aux';
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
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8} textAlign="center">
              <h2>{user.name}</h2>
              <img
                src="https://via.placeholder.com/200x200"
                alt="Profile Picture"
              />
            </Grid.Column>
            <Grid.Column width={8} verticalAlign="middle">
              <p>
                {locales.dob}:{' '}
                {new Date(user.dob).toLocaleString(
                  locales.getLanguage(),
                  options
                )}
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
                {user.role && (
                  <Aux>
                    {locales.role}:{' '}
                    <Label key={user.role.id} color={user.role.color}>
                      {user.role.abbreviation}
                    </Label>
                  </Aux>
                )}
              </div>
              <p>
                {locales.joined}:{' '}
                {new Date(user.createdAt).toLocaleString(
                  locales.getLanguage(),
                  options
                )}
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
