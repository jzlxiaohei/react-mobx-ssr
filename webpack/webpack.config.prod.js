const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');
const _ = require('lodash');
const constants = require('../constants');


const config = webpackMerge(commonConfig, {
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js', // chunkFilename: '[name].[hash].js',
    publicPath:'/assets/'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ],
  },
  plugins: [
    require('./assetsPlugin'),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("[name].[chunkhash].css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: function (module, count) {
        //非页面下的资源，都是common的
        return module.resource && !_.startsWith(module.resource, constants.pageBaseDir)
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['common']
    })
  ]
});


module.exports = config;