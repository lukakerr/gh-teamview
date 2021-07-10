import { SagaMiddleware } from 'redux-saga';

import sagas from 'sagas';

export const SagaManager = {

  /**
   * Start all sagas
   * @param sagaMiddleware  the saga middleware
   */
  startSagas(sagaMiddleware: SagaMiddleware<{}>): void {
    sagas.map(sagaMiddleware.run);
  },

};
