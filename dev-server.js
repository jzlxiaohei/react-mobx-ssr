
global.__IS_NODE__ = true;
require('./webpack/webpack.config.common');
require('babel-core/register');
require('babel-polyfill');


require('./dev-server-internal');