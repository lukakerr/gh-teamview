/**
 * React
 */
import * as React from 'react';
import { render } from 'react-dom';

/**
 * Redux store
 */
import { store, persistor } from './store';

/**
 * Main app container
 */
import { App } from 'containers';

declare const module: any;

/**
 * Create app element
 */
const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);

/**
 * Render app container
 */
render(
  <App store={store} persistor={persistor} />,
  document.getElementById('app')
);

/**
 * Webpack HMR
 */
if (module.hot) {
  module.hot.accept();
}
