import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { withRedux } from '../utils';

class GuestRoute extends Component {
  render() {
    const { auth } = this.props;
    return !auth ? <Route {...this.props} /> : <Redirect to="/" />;
  }
}

export default withRedux(GuestRoute);
