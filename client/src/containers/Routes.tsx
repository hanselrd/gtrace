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
import Profile from '@app/routes/Profile';
import Login from '@app/routes/Login';

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
        <AuthRoute exact path="/profile/:id" component={Profile} />
        <GuestRoute exact path="/login" component={Login} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
