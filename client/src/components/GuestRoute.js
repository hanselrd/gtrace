import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../utils';

class GuestRoute extends Component {
  render() {
    const { auth } = this.props;
    return !auth.user ? <Route {...this.props} /> : <Redirect to="/" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuestRoute);
