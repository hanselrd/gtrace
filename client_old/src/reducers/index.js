import { combineReducers } from 'redux';
import authReducer from './auth';
import { reducer as formReducer } from 'redux-form';
import localeReducer from './locale';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  locale: localeReducer
});
