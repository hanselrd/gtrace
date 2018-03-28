import { createAction, createReducer, Action } from 'redux-act';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as apollo from '@app/core/apollo';

const authTokenKey = 'trace:auth';

export const authActions = {
  start: createAction('@@auth/START'),
  login: createAction<string>('@@auth/LOGIN'),
  logout: createAction('@@auth/LOGOUT')
};

export const authServices = {
  getAuthToken: () => localStorage.getItem(authTokenKey),
  setAuthToken: (auth: string) => localStorage.setItem(authTokenKey, auth),
  unsetAuthToken: () => localStorage.removeItem(authTokenKey),
  resetApolloClient: () => apollo.client.resetStore(),
  resetApolloSubscriptionClient: () => apollo.subscriptionClient.close(false)
};

export const authSagas = {
  start: function*(action: Action<null>) {
    const authToken = yield call(authServices.getAuthToken);
    if (authToken) {
      yield put(authActions.login(authToken));
    }
  },
  login: function*(action: Action<string>) {
    yield all([
      call(authServices.setAuthToken, action.payload),
      call(authServices.resetApolloClient),
      call(authServices.resetApolloSubscriptionClient)
    ]);
  },
  logout: function*(action: Action<null>) {
    yield all([
      call(authServices.unsetAuthToken),
      call(authServices.resetApolloClient),
      call(authServices.resetApolloSubscriptionClient)
    ]);
  }
};

export const authSaga = function*() {
  yield all([
    takeLatest(authActions.start.getType(), authSagas.start),
    takeLatest(authActions.login.getType(), authSagas.login),
    takeLatest(authActions.logout.getType(), authSagas.logout)
  ]);
};

export type AuthState = Readonly<{
  auth?: string;
}>;

const reducer = createReducer<AuthState>({}, {});

reducer.on(authActions.login, (state, payload) => ({
  ...state,
  auth: payload
}));

reducer.on(authActions.logout, state => ({
  ...state,
  auth: undefined
}));

export default reducer;
