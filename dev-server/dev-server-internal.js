import '../require-hook';

import React from 'react';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import httpProxy from "http-proxy";
import _ from 'lodash';
import cors from 'cors';
import config from '../webpack/webpack.config.dev';
import wrapRouteWithLoadPage from '../src/routes/wrapRouteWithLoadPage';
import loadPageServer from '../server/loadPageServer';
import getComponentInfoByPath from '../server/getComponentInfoByPath';
import renderView from '../server/renderView'
import chokidar from 'chokidar';

const routeConfigPath = path.join(__dirname,'../src/routes/config.js');
let routes;
function loadRoutes(){
  routes = require(routeConfigPath);
  wrapRouteWithLoadPage(routes, loadPageServer);
}

chokidar.watch(routeConfigPath).on('all', (event, path) => {
  //remove require cache first
  delete require.cache[require.resolve(routeConfigPath)];
  loadRoutes();
});


const app = express();
const apiProxy = httpProxy.createProxyServer();
const compiler = webpack(config);


function asyncWrapper(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

app.use(cors());

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: '',
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(function (req, res, next) {
  if (req.path.indexOf("/dist/") == 0) {
    return res.sendFile(path.join(__dirname, req.path))
  }
  return next()
});

app.use(function (req, res, next) {

  if (_.startsWith(req.path, '/api')) {
    var originalUrl = req.originalUrl;
    if (originalUrl.indexOf('?') > -1) {
      originalUrl += '&'
    }
    return apiProxy.web(req, res, {
      prependPath: false,
      target: 'https://www.v2ex.com' + originalUrl,
      changeOrigin: true
    })
  }
  return next();
});



app.get('*', asyncWrapper(async function (req, res, next) {
  if(req.path === '/favicon.ico'){
    return res.end();
  }
  const compInfo = await getComponentInfoByPath(req.path, routes);
  const html = renderView(compInfo);
  res.end(html);
}));


process.on('uncaughtException', function (err) {
  console.log(err);
});
process.on("unhandledRejection", (err, p) => {
  console.error(err); // print the error
  console.error(err.stack)
});

var devPort = 3333;
app.listen(devPort, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + devPort);
});

