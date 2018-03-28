import { createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import rootReducer, { rootSaga, RootState } from '@app/ducks';

let store: Store<RootState>;

const sagaMiddleware = createSagaMiddleware();

if (process.env.NODE_ENV !== 'production') {
  store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
  );
} else {
  store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

export default store;
