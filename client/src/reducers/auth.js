import { createReducer } from 'redux-act';
import { createReducerAsync } from 'redux-act-async';
import { combineReducers } from 'redux';
import {
  authTokenFound,
  authTokenNotFound,
  authSetToken,
  authUnsetToken
} from '../actions/auth';

const userReducer = createReducer(
  {
    [authTokenFound]: (state, payload) => payload,
    [authTokenNotFound]: state => null
  },
  null
);

export default combineReducers({
  user: userReducer,
  setToken: createReducerAsync(authSetToken),
  unsetToken: createReducerAsync(authUnsetToken)
});
