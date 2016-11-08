import '../../require-hook';
import routes from '../../src/routes/config';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CleanCSS from 'clean-css';
import bluebird from 'bluebird'
import constants from '../../constants';
import { isFileInPageDir, isFileWithSuffixes } from '../utils/fileFilter';
import { getRelatedModules, getStyleModuleContent } from '../utils/moduleUtils'
import renderView, { renderFallbackView } from '../renderView';
import fsExtra from 'fs-extra';

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


const allPromises = routes.map(route => {
  const loadPath = route.loadPath;
  if (loadPath) {
    const pageName = loadPath;
    const routePath = (route.path == '/' || route.path == '') ? 'index' : route.path;
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
    // TODO minify html use html-minifier

    // TODO generate html just for demo, remove it!!!
    fsExtra.outputFileSync(path.join(constants.htmlBuildDir, routePath) + '.html', html);
    return outputFile(path.join(constants.htmlBuildDir, routePath) + '.json', JSON.stringify(result));
  }
});

const fallbackHtml = renderFallbackView();
const fallbackPromise = outputFile(path.join(constants.htmlBuildDir, 'fallback.html'),fallbackHtml);

allPromises.push(fallbackPromise);
Promise.all(allPromises).then(() => console.log('html files created'));


