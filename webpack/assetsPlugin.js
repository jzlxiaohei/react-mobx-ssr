const AssetsPlugin = require('assets-webpack-plugin');
const constants = require('../constants');

const assetsPluginInstance = new AssetsPlugin({
  prettyPrint: true,
  path: constants.manifestDir,
});

module.exports = assetsPluginInstance;