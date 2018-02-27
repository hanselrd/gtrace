import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { wsClient } from '../../';
import { mapStateToProps, mapDispatchToProps } from '../../utils';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
// import locales from '../../locales';

class Home extends Component {
  componentWillMount() {
    this.props.subscribeToNewUser();
  }

  render() {
    const { data: { loading, users } } = this.props;
    return (
      <div className="Home">
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
        {loading && <p>Loading...</p>}
        {!loading &&
          users &&
          users.map(user => {
            return (
              <p key={user.id}>
                <NavLink to={'/profile/' + user.id}>{user.name}</NavLink>
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
      name
    }
  }
`;

const newUserSubscription = gql`
  subscription {
    newUser {
      id
      name
    }
  }
`;

export default compose(
  graphql(usersQuery, {
    props: props => {
      return {
        ...props,
        subscribeToNewUser: params => {
          return props.data.subscribeToMore({
            document: newUserSubscription,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev;
              }

              const { newUser } = subscriptionData.data;
              return { ...prev, users: [...prev.users, newUser] };
            }
          });
        }
      };
    }
  }),
  withApollo,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
