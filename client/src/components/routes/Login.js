import React, { Component } from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import renderField from '../renderField';
import { Link } from 'react-router-dom';
import { withRedux } from '../../utils';
import { wsClient } from '../../';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const required = value => (value ? undefined : 'Required');

class Login extends Component {
  onSubmit = async ({ email, password }) => {
    try {
      const response = await this.props.mutate({
        variables: { email, password }
      });
      const { token } = response.data.login;
      this.props.authSetToken({ token });
      this.props.client.resetStore();
      wsClient.close(true);
      this.props.reset(); // clear form
    } catch (error) {
      throw new SubmissionError(error.graphQLErrors[0].data);
    }
  };

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <div className="Login">
        <Container text>
          <Header as="h2">Login</Header>
          <Form onSubmit={handleSubmit(this.onSubmit)} loading={submitting}>
            <Field
              name="email"
              label="Email"
              type="email"
              component={renderField}
              validate={required}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              component={renderField}
              validate={required}
            />
            <Button primary type="submit" disabled={submitting}>
              Submit
            </Button>
            <Button as={Link} to="/signup">
              Create an account
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default compose(
  graphql(LOGIN_MUTATION),
  withApollo,
  withRedux,
  reduxForm({ form: 'login', destroyOnUnmount: false })
)(Login);
