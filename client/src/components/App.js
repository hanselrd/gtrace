import React, { Component } from 'react';
import '../styles/App.css';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../utils';
import Routes from './Routes';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.authSearchForTokenInLocalStorage();
  }

  render() {
    return (
      <div className="App">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
        </ul>
        <Routes />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
