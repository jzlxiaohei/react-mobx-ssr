import path from 'path';
import constants from '../constants';
import { isFileWithSuffixes } from './utils/fileFilter';
import { getRelatedModules, getStyleModuleContent } from './utils/moduleUtils'

function findStyleModule(modules) {
  return modules.filter(module=> {
    const filename = module.filename;
    return isFileWithSuffixes(filename, [
      '.scss',
      '.css'
    ])
  });
}

function loadPageServer(pageName) {
  const pagePath = path.join(constants.pageBaseDir, pageName);
  const component = require(pagePath);

  if (!constants.isProduction) {
    const firstModule = require.cache[require.resolve(pagePath)];
    const relatedModules = getRelatedModules(firstModule);

    if(constants.injectCssOnDev){
      const styleModules = findStyleModule(relatedModules);
      component.$css = getStyleModuleContent(styleModules);
    }
    relatedModules.forEach(m => {
      delete require.cache[require.resolve(m.filename)]
    });
  }
  component.$pageJsPath = `${constants.pageJsPrefix}/${pageName}.js`;
  return Promise.resolve(component);
}

export default loadPageServer