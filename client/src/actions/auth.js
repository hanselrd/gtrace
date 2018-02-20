import { createAction } from 'redux-act';
import { createActionAsync } from 'redux-act-async';

export const authStart = createAction('@@auth/start');
export const authTokenFound = createAction('@@auth/token found');
export const authTokenNotFound = createAction('@@auth/token not found');

export const authSearchForTokenInLocalStorage = () => {
  return dispatch => {
    dispatch(authStart());
    const token = localStorage.getItem(
      process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY
    );
    if (token) {
      dispatch(authTokenFound({ token }));
    } else {
      dispatch(authTokenNotFound());
    }
  };
};

export const authSetToken = createActionAsync(
  '@@auth/set token',
  async ({ token }) => {
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY, token);
  }
);

export const authUnsetToken = createActionAsync(
  '@@auth/unset token',
  async () => {
    localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY);
  }
);
