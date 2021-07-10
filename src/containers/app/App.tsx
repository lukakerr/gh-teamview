import * as React from 'react';
import { ReactNode } from 'react';

import { Store } from 'redux';
import { Provider } from 'react-redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Error, Home } from 'containers';

import './app.scss';
import * as styles from './app.scss';

export interface AppProps {
  store: Store<{}>;
  persistor: Persistor;
}

export class App extends React.Component<AppProps, {}> {
  renderLoading = (): ReactNode => {
    return (
      <div>Loading...</div>
    );
  }

  renderRoutes = (): ReactNode => {
    return (
      <div className={styles.app}>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route component={Error} />
        </Switch>
      </div >
    );
  }

  render = () => {
    const { store, persistor } = this.props;

    return (
      <Provider store={store}>
        <PersistGate loading={this.renderLoading()} persistor={persistor}>
          <Router>
            {this.renderRoutes()}
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}
