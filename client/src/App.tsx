import * as React from 'react';
import Home from '@app/components/Home';
import { connect } from 'react-redux';
import { RootState } from '@app/ducks';
import { authActions } from '@app/ducks/auth';
import { localeActions } from '@app/ducks/locale';

export interface AppProps {
  authStart: typeof localeActions.start;
  localeStart: typeof localeActions.start;
}

class App extends React.Component<AppProps & RootState> {
  componentWillMount() {
    this.props.authStart();
    this.props.localeStart();
  }

  render() {
    return (
      <div className="App">
        <Home />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => state;

const mapDispatchToProps = {
  authStart: authActions.start,
  localeStart: localeActions.start
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
