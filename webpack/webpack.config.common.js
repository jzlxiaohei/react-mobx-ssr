const path = require('path');

const webpack = require('webpack');
const _ = require('lodash');
const constants = require('../constants');

// const getEntries = require('./utils/getEntries');

const rawEntries = { main: path.join(__dirname, '../src/main.js') };

const entries = _.mapValues(rawEntries, (value) => {
  if (process.env.NODE_ENV !== 'production') {
    return ['react-hot-loader/patch', 'webpack-hot-middleware/client?reload=false', value];
  }
  return [value];
});

module.exports = {
  entry: entries,
  output: {
    path: path.join(constants.distBaseDir,'assets'),
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: '[name].js', // chunkFilename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['', '.js', '.scss'],
    alias: {
      config: constants.srcBaseDir + '/config/' + (process.env.FE_ENV || "development") + '.js',
      comps: constants.srcBaseDir + '/components',
      infra: constants.srcBaseDir + '/infrastructure',
      core: constants.srcBaseDir + '/core',
    }
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        loaders: ['babel?cacheDirectory=true'],
        exclude: /node_modules/
      },

    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__IS_NODE__': JSON.stringify(false)
    }), new webpack.optimize.OccurenceOrderPlugin()
  ]
};
