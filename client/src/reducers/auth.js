import { createReducer } from 'redux-act';
import { _authTokenFound, _authTokenNotFound } from '../actions/auth';

export default createReducer(
  {
    [_authTokenFound]: (state, payload) => payload,
    [_authTokenNotFound]: state => null
  },
  null
);
