import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { RootState } from '@app/ducks';
import { authActions, AuthState } from '@app/ducks/auth';
import { localeActions, LocaleState } from '@app/ducks/locale';
import locale from '@app/core/locale';

const logo = require('@app/images/logo.png');

export interface HomeProps {
  authLogin: typeof authActions.login;
  authLogout: typeof authActions.logout;
  localeChange: typeof localeActions.change;
}

const Home: React.SFC<HomeProps & AuthState & LocaleState> = props => (
  <div className="Home">
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
        onClick={() => props.authLogin('secret-auth-token')}
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

const mapStateToProps = (state: RootState) => ({
  ...state.auth,
  ...state.locale
});

const mapDispatchToProps = {
  authLogin: authActions.login,
  authLogout: authActions.logout,
  localeChange: localeActions.change
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
