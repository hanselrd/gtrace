import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Scroll from 'react-scroll';
import AuthRoute from './AuthRoute';
import GuestRoute from './GuestRoute';
import Home from './routes/Home';
import Login from './routes/Login';

class Routes extends Component {
  // componentDidUpdate(prevProps) {
  //   if (this.props.location !== prevProps.location) {
  //     Scroll.animateScroll.scrollToTop();
  //   }
  // }

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
      </Switch>
    );
  }
}

export default withRouter(Routes);
