import React, { Component } from 'react';
import {
  Button,
  Container,
  Form,
  Header,
  Input,
  Select
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withFormik } from 'formik';
import { withRedux } from '../../utils';
import { wsClient } from '../../';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const options = [
  { key: 'en', text: 'English', value: 'en' },
  { key: 'es', text: 'Spanish', value: 'es' }
];

class Signup extends Component {
  // onSubmit = async ({ name, email, password, language }) => {
  //   const response = await this.props.signup({
  //     variables: { name, email, password, language }
  //   });
  //   const { status, payload, errors } = response.data.signup;
  //   if (status) {
  //     const { token } = payload;
  //     this.props.authSetToken({ token });
  //     this.props.client.resetStore();
  //     wsClient.close(true);
  //     this.props.reset(); // clear form
  //   } else {
  //     // server-side errors
  //     // errors.map(error => {
  //     //   throw new SubmissionError({
  //     //     [error.path]: error.message
  //     //   });
  //     // });
  //   }
  // };

  render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting
    } = this.props;
    return (
      <div className="Signup">
        <Container text>
          <Header as="h2">Signup</Header>
          <Form onSubmit={handleSubmit} loading={isSubmitting}>
            <Form.Field error={touched.name && !!errors.name}>
              <label>Name</label>
              <Input
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Field>
            <Form.Field error={touched.email && !!errors.email}>
              <label>Email</label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Field>
            <Form.Field error={touched.password && !!errors.password}>
              <label>Password</label>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Field>
            <Button primary type="submit" disabled={isSubmitting}>
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

const SIGNUP_MUTATION = gql`
  mutation(
    $name: String!
    $email: String!
    $password: String!
    $dob: Date!
    $language: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      dob: $dob
      language: $language
    ) {
      token
    }
  }
`;

export default compose(
  graphql(SIGNUP_MUTATION),
  withApollo,
  withRedux,
  withFormik({
    mapPropsToValues: props => ({
      name: '',
      email: '',
      password: '',
      dob: '1999-09-09',
      language: 'en'
    }),
    validate: (values, props) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Required';
      }
      if (!values.email) {
        errors.email = 'Required';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      return errors;
    },
    handleSubmit: async (
      { name, email, password, dob, language },
      { props, setSubmitting, setFieldError }
    ) => {
      try {
        const response = await props.mutate({
          variables: { name, email, password, dob, language }
        });
        setSubmitting(false);
        const { token } = response.data.signup;
        props.authSetToken({ token });
        props.client.resetStore();
        wsClient.close(true);
      } catch (error) {
        setSubmitting(false);
        // server-side errors
        Object.keys(error.graphQLErrors[0].data).forEach(key => {
          console.log(error.graphQLErrors[0].data[key][0]);
          setFieldError(key, error.graphQLErrors[0].data[key][0]);
        });
        // errors.map(error => {
        //   // throw new SubmissionError({
        //   //   [error.path]: error.message
        //   // });
        // });
      }
    }
  })
)(Signup);
