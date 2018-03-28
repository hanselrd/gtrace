import * as React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  Button,
  Dimmer,
  Form,
  Header,
  Loader,
  Segment
} from 'semantic-ui-react';
import { withFormik, FormikProps } from 'formik';
import yup from 'yup';
import { authActions } from '@app/ducks/auth';
import locale from '@app/core/locale';
import LOGIN_MUTATION, {
  LoginMutationProps,
  LoginMutationVariables
} from '@app/graphql/mutations/login';

const mapDispatchToProps = {
  authLogin: authActions.login
};

export type LoginProps = LoginMutationProps &
  typeof mapDispatchToProps &
  FormikProps<LoginMutationVariables>;

const Login: React.SFC<LoginProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  setFieldTouched
}) => (
  <div>
    <Segment inverted>
      <Header as="h2">{locale.login}</Header>
      <Dimmer active={isSubmitting}>
        <Loader>{locale.verifyingCredentials}...</Loader>
      </Dimmer>
      <Form inverted onSubmit={handleSubmit}>
        <Form.Field error={touched.email && !!errors.email}>
          <Form.Input
            fluid
            name="email"
            type="email"
            label={locale.email}
            placeholder={locale.email}
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
          <Form.Input
            fluid
            name="password"
            type="password"
            label={locale.password}
            placeholder={locale.password}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password &&
            errors.password && (
              <label style={{ fontSize: '0.8em' }}>{errors.password}</label>
            )}
        </Form.Field>
        <Button primary type="submit" disabled={isSubmitting}>
          {locale.submit}
        </Button>
        <Button color="green" as={Link} to="/signup">
          {locale.createAnAccount}
        </Button>
      </Form>
    </Segment>
  </div>
);

export default compose(
  graphql(LOGIN_MUTATION),
  connect(null, mapDispatchToProps),
  withFormik<LoginProps, LoginMutationVariables>({
    mapPropsToValues: props => ({ email: '', password: '' }),
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required()
        .email(),
      password: yup
        .string()
        .required()
        .min(6)
    }),
    handleSubmit: async (
      { email, password },
      { props, setSubmitting, setFieldError }
    ) => {
      if (props.mutate) {
        try {
          const response = await props.mutate({
            variables: { email, password }
          });
          const { token } = response.data.login;
          props.authLogin(token);
        } catch (error) {
          Object.keys(error.graphQLErrors[0].data).forEach(key =>
            setFieldError(key, error.graphQLErrors[0].data[key])
          );
        }
      }
      setSubmitting(false);
    }
  })
)(Login);
