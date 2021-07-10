const path = require('path');
const express = require('express');
const historyApiFallback = require('connect-history-api-fallback');

const app = express();

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;

const DIST = path.resolve(__dirname, 'dist');

app.use(historyApiFallback({
  verbose: false
}));

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const config = require('./webpack.config.js');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    stats: {
      assets: true,
      colors: true,
      chunks: true,
      children: false
    },
    historyApiFallback: true,
    disableHostCheck: true
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(DIST));

app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.info(`App is listening at http://${HOST}:${PORT}`);
});
