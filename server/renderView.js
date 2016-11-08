import constants from '../constants';

let webpackAssets = {};
if (constants.isProduction) {
  const originAssets = require(constants.webpackAssetsPath);

  // 把originAssets打平 xx:{ js:'' ,css:'' } => { 'xx.js':'','xx.css':''}
  for (const key in originAssets) {
    const assets = originAssets[key];
    for (const type in assets) {
      webpackAssets[key + '.' + type] = assets[type];
    }
  }
}


function getHashPath(entryName) {
  if (constants.isProduction) {
    if (entryName.startsWith('/')) {
      entryName = entryName.substr(1)
    }
    if (!(entryName in webpackAssets)) {
      throw new Error(`${entryName} not in webpack-assets.json`);
    }
    return webpackAssets[entryName];
  } else {
    return entryName;
  }
}

function createLink(src) {
  return `<link rel="stylesheet" type="text/css" href="${src}">`
}

function createScript(src) {
  return `<script src="${src}"></script>`
}

function renderView(options) {
  return `
 <!DOCTYPE html>
  <html lang="cn">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      ${constants.isProduction ? createLink(getHashPath('common.css')) : ''}
      <style>${ options.cssContent || '' }</style>
      <script>
          window.__mobxInjectedStore=${ options.initData ? JSON.stringify(options.initData):'{{ initDataStr }}' }
      </script>
  </head>
  <body>
      <div id="root">${ options.reactContent || '{{ reactContent }}'}</div>
      
      <div id="global-loading-cover" style="display: none">
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
      </div>
      ${constants.isProduction ? createScript(getHashPath('manifest.js')) : ''}
      ${constants.isProduction ? createScript(getHashPath('common.js')) : ''}
      <script src="${getHashPath('main.js')}"></script>
      <script src="${getHashPath(options.pageJsPath)}"></script>
  </body>
</html>
`
}

function renderFallbackView() {
  return `
 <!DOCTYPE html>
  <html lang="cn">
  <head>
      <base href='/fallback'>
      <meta charset="UTF-8">
      <title>Title</title>
      ${constants.isProduction ? createLink(getHashPath('common.css')) : ''}
  </head>
  <body>
      <div id="root"></div>
      
      <div id="global-loading-cover" style="display: none">
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
      </div>
      ${constants.isProduction ? createScript(getHashPath('manifest.js')) : ''}
      ${constants.isProduction ? createScript(getHashPath('common.js')) : ''}
      <script src="${getHashPath('main.js')}"></script>
  </body>
</html>
`
}

export { renderFallbackView }

export default renderView;
