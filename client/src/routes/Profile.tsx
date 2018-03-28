import * as React from 'react';
import { graphql } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, Label } from 'semantic-ui-react';
import Aux from '@app/utils/Aux';
import locale from '@app/core/locale';
import USER_QUERY, {
  UserQueryProps,
  UserQueryData,
  UserQueryVariables
} from '@app/graphql/queries/user';

export type ProfileProps = RouteComponentProps<any> & UserQueryProps;

class Profile extends React.Component<ProfileProps> {
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

    const dateFormat = { month: 'long', day: 'numeric', year: 'numeric' };

    return (
      <div>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8} textAlign="center">
              <h2>{user.name}</h2>
              <img src="https://via.placeholder.com/200x200" alt="profile" />
            </Grid.Column>
            <Grid.Column width={8} verticalAlign="middle">
              <p>
                {locale.dob}:{' '}
                {new Date(user.dob).toLocaleString(
                  locale.getLanguage(),
                  dateFormat
                )}
              </p>
              <p>
                {locale.email}: {user.email}
              </p>
              <p>
                {locale.language}:{' '}
                {user.language === 'en'
                  ? locale.english
                  : user.language === 'es' ? locale.spanish : null}
              </p>
              <p>
                {locale.online}: {user.online ? locale.yes : locale.no}
              </p>
              <p>
                {user.role && (
                  <Aux>
                    {locale.role}:{' '}
                    <Label
                      as="span"
                      key={user.role.id}
                      color={user.role.color as any}
                    >
                      {user.role.abbreviation}
                    </Label>
                  </Aux>
                )}
              </p>
              <p>
                {locale.joined}:{' '}
                {new Date(user.createdAt).toLocaleString(
                  locale.getLanguage(),
                  dateFormat
                )}
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default graphql<ProfileProps, UserQueryData, UserQueryVariables>(
  USER_QUERY,
  {
    options: ({ match }) => ({
      variables: {
        id: match.params.id
      }
    })
  }
)(Profile);
