import { createAction } from 'redux-act';

export const _authTokenFound = createAction('@@auth/token found');
export const _authTokenNotFound = createAction('@@auth/token not found');

export const authStart = () => {
  return dispatch => {
    const token = localStorage.getItem(
      process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY
    );
    if (token) {
      dispatch(_authTokenFound({ token }));
    } else {
      dispatch(_authTokenNotFound());
    }
  };
};

export const _authSetToken = createAction('@@auth/set token');

export const authSetToken = ({ token }) => {
  return dispatch => {
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY, token);
    dispatch(_authSetToken());
    dispatch(authStart());
  };
};

export const _authUnsetToken = createAction('@@auth/unset token');

export const authUnsetToken = () => {
  return dispatch => {
    localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_TOKEN_KEY);
    dispatch(_authUnsetToken());
    dispatch(authStart());
  };
};
