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
import yup from 'yup';
import { withRedux } from '../../utils';
import { wsClient } from '../../';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';

const languageOptions = [
  { key: 'en', text: 'English', value: 'en' },
  { key: 'es', text: 'Spanish', value: 'es' }
];

class Signup extends Component {
  render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      setFieldTouched
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
              {touched.name &&
                errors.name && (
                  <label style={{ fontSize: '0.8em' }}>{errors.name}</label>
                )}
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
              {touched.email &&
                errors.email && (
                  <label style={{ fontSize: '0.8em' }}>{errors.email}</label>
                )}
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
              {touched.password &&
                errors.password && (
                  <label style={{ fontSize: '0.8em' }}>{errors.password}</label>
                )}
            </Form.Field>
            <Form.Field error={touched.dob && !!errors.dob}>
              <label>Date of Birth</label>
              <Input
                name="dob"
                placeholder="yyyy-mm-dd"
                value={values.dob}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.dob &&
                errors.dob && (
                  <label style={{ fontSize: '0.8em' }}>{errors.dob}</label>
                )}
            </Form.Field>
            <Form.Field error={touched.language && !!errors.language}>
              <label>Language</label>
              <Select
                name="language"
                options={languageOptions}
                value={values.language}
                onChange={(e, { name, value }) => setFieldValue(name, value)}
                onBlur={(e, { name, value }) => setFieldTouched(name, value)}
              />
              {touched.language &&
                errors.language && (
                  <label style={{ fontSize: '0.8em' }}>{errors.language}</label>
                )}
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
      dob: '',
      language: 'en'
    }),
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required()
        .min(3)
        .max(25)
        .matches(
          /^[a-z0-9]+$/i,
          'name must only contain alphanumeric characters'
        ),
      email: yup
        .string()
        .required()
        .email(),
      password: yup
        .string()
        .required()
        .min(6),
      dob: yup
        .string()
        .required()
        .matches(/^\d{4}-\d{2}-\d{2}$/, '${path} must be in yyyy-mm-dd format')
        .test(
          'is valid date',
          '${path} is not a valid date',
          value => !isNaN(Date.parse(value))
        )
        .test(
          'is later than 1900-01-01',
          '${path} must be later than 1900-01-01',
          value => Date.parse(value) > Date.parse('1900-01-01')
        )
        .test(
          'is earlier than today',
          `\${path} must be earlier than ${new Date()
            .toISOString()
            .slice(0, 10)}`,
          value => Date.parse(value) < Date.now()
        ),
      language: yup
        .string()
        .required()
        .oneOf(['en', 'es'])
    }),
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
        Object.keys(error.graphQLErrors[0].data).forEach(key => {
          console.log(error.graphQLErrors[0].data[key][0]);
          setFieldError(key, error.graphQLErrors[0].data[key][0]);
        });
      }
    }
  })
)(Signup);
