import '../../require-hook';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CleanCSS from 'clean-css';
import bluebird from 'bluebird'

import fsExtra from 'fs-extra';
import  { minify as htmlMinify} from 'html-minifier';
import routes from '../../src/routes/config';
import constants from '../../constants';
import { isFileInPageDir, isFileWithSuffixes } from '../utils/fileFilter';
import { getRelatedModules, getStyleModuleContent } from '../utils/moduleUtils'
import renderView, { renderFallbackView } from '../renderView';
import getViewPathByLoadPath from '../getViewPathByLoadPath';

const outputFile = bluebird.promisify(fsExtra.outputFile);

const cleanCss = new CleanCSS();

function findStyleModule(modules) {
  return modules.filter(module=> {
    const filename = module.filename;
    return isFileWithSuffixes(filename, [
        '.scss',
        '.css'
      ]) && isFileInPageDir(filename)
  });
}

function getMinifyHtml(html) {
  return  htmlMinify(html, {
    minifyCSS: true,
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true
  });
}

const allPromises = routes.map(route => {
  const loadPath = route.loadPath;
  if (loadPath) {
    const pageName = loadPath;
    const pagePath = path.join(constants.pageBaseDir, pageName);
    const component = require(pagePath);
    const firstModule = require.cache[require.resolve(pagePath)];
    const relatedModules = getRelatedModules(firstModule);
    const styleModules = findStyleModule(relatedModules);
    const cssContent = getStyleModuleContent(styleModules);
    const result = {
      cssContent: cleanCss.minify(cssContent).styles,
      pageJsPath: `${constants.pageJsPrefix}/${pageName}.js`
    };

    if (!component.fetchInitData) {
      result.reactContent = ReactDOMServer.renderToString(React.cloneElement(component));
    }
    const html = renderView(result);
    const minifyHtml = getMinifyHtml(html)
    const viewPath = getViewPathByLoadPath(loadPath);
    return outputFile(path.join(constants.htmlBuildDir, viewPath), minifyHtml);
  }
});

const fallbackHtml = renderFallbackView();
const fallbackPromise = outputFile(path.join(constants.htmlBuildDir, 'fallback.html'), getMinifyHtml(fallbackHtml));

allPromises.push(fallbackPromise);
Promise.all(allPromises).then(() => console.log('html files created'));


