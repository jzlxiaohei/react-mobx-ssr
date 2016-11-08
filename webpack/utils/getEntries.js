const path = require('path');
const glob = require('glob-all');

function filterFiles(files) {
  var argv = require('yargs').argv;
  if (!argv.f) {
    return files;
  }
  const filterReg = new RegExp(argv.f);

  return files.filter(file=>filterReg.test(file));
}


function getEntries(patterns, basePath) {
  const allFiles = glob.sync(patterns.map(pattern=>path.join(basePath, pattern)));
  const files = filterFiles(allFiles);

  const entryObj = {};

  files.forEach(filePath=> {
    const fileNameWithoutBase = path.relative(basePath, filePath);
    const key = fileNameWithoutBase.substring(0, fileNameWithoutBase.lastIndexOf('.'));
    entryObj[key] = filePath
  });

  return entryObj;
}

module.exports = getEntries;