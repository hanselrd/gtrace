import { createAction, createReducer, Action } from 'redux-act';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import locale from '@app/core/locale';

const langTokenKey = 'trace:lang';

export const localeActions = {
  start: createAction('@@locale/START'),
  change: createAction<string>('@@locale/CHANGE')
};

export const localeServices = {
  getPersistedLang: () => localStorage.getItem(langTokenKey),
  setPersistedLang: (lang: string) => localStorage.setItem(langTokenKey, lang),
  getAppLang: () => locale.getLanguage(),
  setAppLang: (lang: string) => locale.setLanguage(lang)
};

export const localeSagas = {
  start: function*(action: Action<null>) {
    const persistedLang = yield call(localeServices.getPersistedLang);
    if (persistedLang) {
      yield put(localeActions.change(persistedLang));
    } else {
      const appLang = yield call(localeServices.getAppLang);
      yield put(localeActions.change(appLang));
    }
  },
  change: function*(action: Action<string>) {
    yield all([
      call(localeServices.setPersistedLang, action.payload),
      call(localeServices.setAppLang, action.payload)
    ]);
  }
};

export const localeSaga = function*() {
  yield all([
    takeEvery(localeActions.start.getType(), localeSagas.start),
    takeEvery(localeActions.change.getType(), localeSagas.change)
  ]);
};

export type LocaleState = Readonly<{
  lang: string;
}>;

const reducer = createReducer<LocaleState>({}, { lang: 'en' });

reducer.on(localeActions.change, (state, payload) => ({
  ...state,
  lang: payload
}));

export default reducer;
