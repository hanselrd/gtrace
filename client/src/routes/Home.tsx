import * as React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Button } from 'semantic-ui-react';
import { RootState } from '@app/ducks';
import { authActions } from '@app/ducks/auth';
import { localeActions } from '@app/ducks/locale';
import ReturnType from '@app/utils/ReturnType';
import locale from '@app/core/locale';
import LOGIN_MUTATION, {
  LoginMutationProps
} from '@app/graphql/mutations/login';

const logo = require('@app/images/logo.png');

const mapStateToProps = (state: RootState) => ({
  ...state.auth,
  ...state.locale
});
const dummy = ReturnType(mapStateToProps);

const mapDispatchToProps = {
  authLogin: authActions.login,
  authLogout: authActions.logout,
  localeChange: localeActions.change
};

export type HomeProps = LoginMutationProps &
  typeof dummy &
  typeof mapDispatchToProps;

const Home: React.SFC<HomeProps> = props => (
  <div>
    <img src={logo} alt="logo" width={100} />
    <p>Current locale: {props.lang}</p>
    <p>Auth: {JSON.stringify(props.auth)}</p>
    <Button
      color="green"
      inverted
      onClick={() => {
        props.lang === 'en'
          ? props.localeChange('es')
          : props.localeChange('en');
      }}
    >
      Change to {props.lang === 'en' ? locale.spanish : locale.english}
    </Button>
    {!props.auth ? (
      <Button
        color="blue"
        inverted
        onClick={async () => {
          if (props.mutate) {
            try {
              const response = await props.mutate({
                variables: { email: 'test1@gmail.com', password: '123456' }
              });
              const { token } = response.data.login;
              props.authLogin(token);
            } catch (error) {
              console.log(error);
            }
          }
        }}
      >
        Log in
      </Button>
    ) : (
      <Button color="red" inverted onClick={() => props.authLogout()}>
        Log out
      </Button>
    )}
  </div>
);

export default compose(
  graphql(LOGIN_MUTATION),
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
