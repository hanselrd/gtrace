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
import FieldError from '@app/components/FieldError';
import { authActions } from '@app/ducks/auth';
import locale from '@app/core/locale';
import SIGNUP_MUTATION, {
  SignupMutationProps,
  SignupMutationVariables
} from '@app/graphql/mutations/signup';

const mapDispatchToProps = {
  authLogin: authActions.login
};

export type SignupProps = SignupMutationProps &
  typeof mapDispatchToProps &
  FormikProps<SignupMutationVariables>;

const Signup: React.SFC<SignupProps> = ({
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
      <Header as="h2">{locale.signup}</Header>
      <Dimmer active={isSubmitting}>
        <Loader>{locale.verifyingCredentials}...</Loader>
      </Dimmer>
      <Form inverted onSubmit={handleSubmit}>
        <Form.Field error={touched.name && !!errors.name}>
          <Form.Input
            fluid
            name="name"
            label={locale.name}
            placeholder={locale.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FieldError touched={touched.name} error={errors.name} />
        </Form.Field>
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
          <FieldError touched={touched.email} error={errors.email} />
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
          <FieldError touched={touched.password} error={errors.password} />
        </Form.Field>
        <Form.Field error={touched.dob && !!errors.dob}>
          <Form.Input
            fluid
            name="dob"
            label={locale.dob}
            placeholder="yyyy-mm-dd"
            value={values.dob}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FieldError touched={touched.dob} error={errors.dob} />
        </Form.Field>
        <Form.Field error={touched.language && !!errors.language}>
          <Form.Select
            fluid
            name="language"
            label={locale.language}
            value={values.language}
            onChange={(e, { name, value }) => setFieldValue(name, value)}
            onBlur={(e, { name, value }) => setFieldTouched(name, !!value)}
            options={[
              { key: 'en', text: locale.english, value: 'en' },
              { key: 'es', text: locale.spanish, value: 'es' }
            ]}
          />
          <FieldError touched={touched.language} error={errors.language} />
        </Form.Field>
        <Button primary type="submit" disabled={isSubmitting}>
          {locale.submit}
        </Button>
        <Button color="green" as={Link} to="/login">
          {locale.alreadyHaveAnAccount}
        </Button>
      </Form>
    </Segment>
  </div>
);

export default compose(
  graphql(SIGNUP_MUTATION),
  connect(null, mapDispatchToProps),
  withFormik<SignupProps, SignupMutationVariables>({
    mapPropsToValues: () => ({
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
      if (props.mutate) {
        try {
          const response = await props.mutate({
            variables: { name, email, password, dob, language }
          });
          const { token } = response.data.signup;
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
)(Signup);
