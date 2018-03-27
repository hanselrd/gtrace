import { createReducer } from 'redux-act';
import { localeStart, localeChange } from '../actions/locale';
import locales from '../locales';

export default createReducer(
  {
    [localeStart]: state => locales.getLanguage(),
    [localeChange]: (state, payload) => {
      locales.setLanguage(payload);
      return locales.getLanguage();
    }
  },
  null
);
