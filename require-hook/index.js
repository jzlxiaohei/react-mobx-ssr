const fs = require('fs');
const sass = require('node-sass');
const constants = require('../constants');

function hook(compile, extension) {
  require.extensions[extension] = function (m, filename) {
    const tokens = compile(filename);
    return m._compile('module.exports = ' + JSON.stringify(tokens), filename);
  };
}

function compileSass(filename) {
  const sassContent = sass.renderSync({
    file: filename,
    includePaths: [constants.srcBaseDir]
  });
  return sassContent.css.toString();
}

function outputFileContent(fileName) {
  return fs.readFileSync(fileName).toString();
}

function empty() {
  return ''
}


if (constants.isProduction && !constants.isBuild) {
  hook(empty, '.scss');
  hook(empty, '.css');
} else {
  hook(compileSass, '.scss');
  hook(outputFileContent, '.css');
}


function ignoreStyle() {
  hook(empty, '.scss');
  hook(empty, '.css');
}

function compileStyle() {
  hook(compileSass, '.scss');
  hook(outputFileContent, '.css');
}

export {
  ignoreStyle, compileStyle
}
