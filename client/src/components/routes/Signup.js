import React, { Component } from 'react';
import { Button, Container, Form, Header, Select } from 'semantic-ui-react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import renderField from '../renderField';
import { Link } from 'react-router-dom';
import { withRedux } from '../../utils';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const required = value => (value ? undefined : 'Required');
const options = [
  { key: 'en', text: 'English', value: 'en' },
  { key: 'es', text: 'Spanish', value: 'es' }
];

class Signup extends Component {
  onSubmit = async ({ name, email, password, language }) => {
    const response = await this.props.signup({
      variables: { name, email, password, language }
    });
    const { status, payload, errors } = response.data.register;
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
      <div className="Signup">
        <Container text>
          <Header as="h2">Signup</Header>
          <Form onSubmit={handleSubmit(this.onSubmit)} loading={submitting}>
            <Field
              name="name"
              label="Name"
              type="text"
              component={renderField}
              validate={required}
            />
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
            <Field
              name="language"
              label="Language"
              control={Select}
              options={options}
              component={renderField}
              validate={required}
            />
            <Button primary type="submit" disabled={submitting}>
              Submit
            </Button>
            <Button as={Link} to="/login">
              I already have an account
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

const signupMutation = gql`
  mutation(
    $name: String!
    $email: String!
    $password: String!
    $language: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      language: $language
    ) {
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
  graphql(signupMutation, { name: 'signup' }),
  withApollo,
  withRedux,
  reduxForm({ form: 'signup', destroyOnUnmount: false })
)(Signup);
