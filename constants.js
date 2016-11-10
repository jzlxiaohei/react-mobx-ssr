const path = require('path');

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  isBuild: process.env.SSR_ENV === 'build',
  srcBaseDir: path.join(__dirname, 'src'),
  pageBaseDir: path.join(__dirname, 'src/pages'),
  distBaseDir: path.join(__dirname, 'dist'),
  manifestDir: path.join(__dirname, 'manifest'),
  webpackAssetsPath: path.join(path.join(__dirname, 'manifest/webpack-assets.json')),
  htmlBuildDir: path.join(__dirname, 'server/views'),
  cdnPath: '/',
  pageJsPrefix: 'pages',
  injectCssOnDev: true
};