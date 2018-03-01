import React, { Component } from 'react';
import { /*Route,*/ Switch, withRouter } from 'react-router-dom';
import Scroll from 'react-scroll';
import AuthRoute from './AuthRoute';
import GuestRoute from './GuestRoute';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Profile from './routes/Profile';

class Routes extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      Scroll.animateScroll.scrollToTop();
    }
  }

  render() {
    return (
      <Switch>
        <AuthRoute exact path="/" component={Home} />
        <GuestRoute exact path="/login" component={Login} />
        <GuestRoute exact path="/signup" component={Signup} />
        <AuthRoute exact path="/profile/:id" component={Profile} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
