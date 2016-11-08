import _ from 'lodash';
import constants from '../../constants';

function isFileWithSuffixes(filename, suffixArr) {
  for (let i = 0; i < suffixArr.length; i += 1) {
    const suffix = suffixArr[i];
    if (_.endsWith(filename, suffix)) {
      return true;
    }
  }
  return false;
}

function isFileInPageDir(filename) {
  return filename.indexOf(constants.pageBaseDir) === 0
}


export {
  isFileInPageDir, isFileWithSuffixes
}