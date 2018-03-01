import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRedux } from '../../utils';
import { wsClient } from '../../';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Chatbox from '../Chatbox';
// import locales from '../../locales';

class Home extends Component {
  componentWillMount() {
    this.props.subscribeToUserAdded();
  }

  render() {
    const { data: { loading, users } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }

    if (!users) {
      return <p>No users found</p>;
    }

    return (
      <div className="Home">
        <Chatbox users={users} />
        <Button
          color="red"
          onClick={() => {
            this.props.authUnsetToken();
            this.props.client.resetStore();
            wsClient.close(true);
          }}
        >
          Logout
        </Button>
        {users.map(user => (
          <p key={user.id}>
            <Link to={'/profile/' + user.id}>{user.name}</Link>
          </p>
        ))}
      </div>
    );
  }
}

const usersQuery = gql`
  query {
    users {
      id
      name
      role {
        id
        abbreviation
        color
      }
    }
  }
`;

const userAddedSubscription = gql`
  subscription {
    userAdded {
      id
      name
      role {
        id
        abbreviation
        color
      }
    }
  }
`;

export default compose(
  graphql(usersQuery, {
    props: props => ({
      ...props,
      subscribeToUserAdded: params =>
        props.data.subscribeToMore({
          document: userAddedSubscription,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const { data: { userAdded } } = subscriptionData;
            return { ...prev, users: [...prev.users, userAdded] };
          }
        })
    })
  }),
  withApollo,
  withRedux
)(Home);
