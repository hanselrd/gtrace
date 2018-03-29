import * as React from 'react';
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import * as Scroll from 'react-scroll';
import AuthRoute from '@app/containers/AuthRoute';
import GuestRoute from '@app/containers/GuestRoute';
import Landing from '@app/routes/Landing';
import Home from '@app/routes/Home';
import Chat from '@app/routes/Chat';
import Games from '@app/routes/Games';
import Profile from '@app/routes/Profile';
import Settings from '@app/routes/Settings';
import Login from '@app/routes/Login';
import Signup from '@app/routes/Signup';
import NotFound from '@app/routes/NotFound';

export type RoutesProps = RouteComponentProps<any>;

class Routes extends React.Component<RoutesProps> {
  componentWillReceiveProps(nextProps: RoutesProps) {
    if (nextProps.location !== this.props.location) {
      Scroll.animateScroll.scrollToTop();
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Landing} />
        <AuthRoute exact path="/home" component={Home} />
        <AuthRoute exact path="/chat" component={Chat} />
        <AuthRoute exact path="/games" component={Games} />
        <AuthRoute exact path="/profile/:id" component={Profile} />
        <AuthRoute exact path="/settings" component={Settings} />
        <GuestRoute exact path="/login" component={Login} />
        <GuestRoute exact path="/signup" component={Signup} />
        <Route path="/" component={NotFound} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
