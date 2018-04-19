import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Container } from 'semantic-ui-react';
import { RootState } from '@app/ducks';
import { authActions } from '@app/ducks/auth';
import { localeActions } from '@app/ducks/locale';
import ReturnType from '@app/utils/ReturnType';
import Routes from '@app/containers/Routes';
import Header from '@app/components/Header';
import CURRENT_USER_QUERY, {
  CurrentUserQueryProps
} from '@app/graphql/queries/currentUser';
import '@app/styles/App.css';

const mapStateToProps = (state: RootState) => state;
const dummy = ReturnType(mapStateToProps);

const mapDispatchToProps = {
  authStart: authActions.start,
  authLogout: authActions.logout,
  localeStart: localeActions.start,
  localeChange: localeActions.change
};

export type AppProps = CurrentUserQueryProps &
  typeof dummy &
  typeof mapDispatchToProps;

class App extends React.Component<AppProps> {
  componentWillMount() {
    this.props.authStart();
    this.props.localeStart();
  }

  render() {
    const {
      data: { currentUser },
      authLogout,
      localeChange
    } = this.props;
    return (
      <div className="App">
        <Header
          user={currentUser}
          authLogout={authLogout}
          localeChange={localeChange}
        />
        <Container text className="App-container">
          <Routes />
        </Container>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default compose(
  graphql(CURRENT_USER_QUERY, { options: { errorPolicy: 'all' } }),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(App);
