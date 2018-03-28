import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from '@app/ducks';
import ReturnType from '@app/utils/ReturnType';

const mapStateToProps = (state: RootState) => state.auth;
const dummy = ReturnType(mapStateToProps);

export type GuestRouteProps = Readonly<{}> & typeof dummy;

const GuestRoute: React.SFC<GuestRouteProps> = props =>
  !props.auth ? <Route {...props} /> : <Redirect to="/home" />;

export default connect(mapStateToProps)(GuestRoute);
