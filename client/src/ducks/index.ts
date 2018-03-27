import { all, fork } from 'redux-saga/effects';
import { combineReducers, Reducer } from 'redux';
import authReducer, { authSaga, AuthState } from './auth';
import localeReducer, { localeSaga, LocaleState } from './locale';

export const rootSaga = function*() {
  yield all([fork(authSaga), fork(localeSaga)]);
};

export type RootState = Readonly<{
  auth: AuthState;
  locale: LocaleState;
}>;

export default <Reducer<RootState>>combineReducers({
  auth: authReducer,
  locale: localeReducer
});
