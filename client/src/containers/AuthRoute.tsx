import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from '@app/ducks';
import ReturnType from '@app/utils/ReturnType';

const mapStateToProps = (state: RootState) => state.auth;
const dummy = ReturnType(mapStateToProps);

export type AuthRouteProps = Readonly<{}> & typeof dummy;

const AuthRoute: React.SFC<AuthRouteProps> = props =>
  props.auth ? <Route {...props} /> : <Redirect to="/login" />;

export default connect(mapStateToProps)(AuthRoute);
