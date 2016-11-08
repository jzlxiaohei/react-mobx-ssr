import includes from 'lodash/includes';

function getRelatedModules(module) {
  let result = [module];
  if (module.children) {
    module.children.forEach(childModule => {
      // circular require. TODO test
      if (!includes(result, childModule)) {
        result = result.concat(getRelatedModules(childModule));
      }
    });
  }
  return result;
}

function getStyleModuleContent(styleModules) {
  return styleModules.map(module => require(module.filename)).join('\n');
}

export { getRelatedModules, getStyleModuleContent };