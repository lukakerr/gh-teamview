import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/es/storage';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';

import { SagaManager } from 'utils';
import reducers from 'reducers';

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const middleware = [
  routerMiddleware(history),
  thunk,
  sagaMiddleware,
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const config = {
  key: 'root',
  storage,
  version: 1,
};

const store = createStore(
  persistReducer(config, reducers),
  applyMiddleware(...middleware)
);

const persistor = persistStore(store);

SagaManager.startSagas(sagaMiddleware);

export {
  store,
  history,
  persistor,
};
