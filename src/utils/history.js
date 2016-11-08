import isNode from 'infra/isNode';
import createHistory from 'history/createBrowserHistory';


const historyConfig = {};
if (!isNode) {
  if (window.location.pathname.indexOf('/fallback') === 0) {
    historyConfig.basename = '/fallback';
  }
}

// if isNode, browserHistory (base on dom) will cause error, return an empty object
const result = isNode ? {} : createHistory(historyConfig);
export default result;