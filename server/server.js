import React from 'react';
import path from 'path';
import fs from 'fs'
import express from 'express';
import _ from 'lodash';
import '../require-hook';
import wrapRouteWithLoadPage from '../src/routes/wrapRouteWithLoadPage';
import loadPageServer from '../server/loadPageServer';
import getComponentInfoByPath from '../server/getComponentInfoByPath';
import routes from '../src/routes/config';
import Handlebars  from 'handlebars'
import getViewPathByLoadPath from './getViewPathByLoadPath'
import constants from '../constants';


wrapRouteWithLoadPage(routes, loadPageServer);
const app = express();

const TplRenderMap = {};

routes.forEach(route=> {
  const loadPath = route.loadPath;
  const viewPath = getViewPathByLoadPath(loadPath);
  const filename = path.join(constants.htmlBuildDir, viewPath);
  const tplStr = fs.readFileSync(filename);
  TplRenderMap[loadPath] = Handlebars.compile(tplStr.toString())
});

function asyncWrapper(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));



app.get('*', asyncWrapper(async function (req, res) {
  const reqPath = req.path;

  // 模拟fallback ,这个应该在nginx里配置
  if (_.startsWith(reqPath, '/fallback')) {
    return res.sendFile(path.join(constants.htmlBuildDir, 'fallback.html'))
  }

  const compInfo = await getComponentInfoByPath(reqPath, routes);

  compInfo.initDataStr = compInfo.initData ? JSON.stringify(compInfo.initData) : 'null';
  const html = TplRenderMap[compInfo.loadPath](compInfo);
  res.end(html);
}));

process.on('uncaughtException', function (err) {
  console.log(err);
});
process.on("unhandledRejection", (err, p) => {
  console.error(err); // print the error
  console.error(err.stack)
});


app.listen(3000, () => {
  console.log('listen 3000');
});




