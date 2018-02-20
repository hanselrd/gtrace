import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Scroll from 'react-scroll';
import Home from './routes/Home';

class Routes extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      Scroll.animateScroll.scrollToTop();
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
