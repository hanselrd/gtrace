import React, { Component } from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import renderField from '../renderField';
import { Link } from 'react-router-dom';
import { withRedux } from '../../utils';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const required = value => (value ? undefined : 'Required');

class Login extends Component {
  onSubmit = async ({ email, password }) => {
    const response = await this.props.login({
      variables: { email, password }
    });
    const { status, payload, errors } = response.data.login;
    if (status) {
      const { token } = payload;
      this.props.authSetToken({ token });
      this.props.client.resetStore();
      this.props.reset(); // clear form
    } else {
      // server-side errors
      errors.map(error => {
        throw new SubmissionError({
          [error.path]: error.message
        });
      });
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

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      payload
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(loginMutation, { name: 'login' }),
  withApollo,
  withRedux,
  reduxForm({ form: 'login', destroyOnUnmount: false })
)(Login);
