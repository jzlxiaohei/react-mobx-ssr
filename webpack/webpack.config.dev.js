const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

const config = webpackMerge(commonConfig, {
  cache: true,
  // devtool: '#eval-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()],
  module: {
    preLoaders: [{
      test: /\.js|\.jsx$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }]
  }
});

module.exports = config;
