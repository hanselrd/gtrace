import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { withRedux } from '../utils';

class AuthRoute extends Component {
  render() {
    const { auth } = this.props;
    return auth ? <Route {...this.props} /> : <Redirect to="/login" />;
  }
}

export default withRedux(AuthRoute);
