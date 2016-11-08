var CleanCSS = require('clean-css');
var source = 'a{font-weight:bold;}';
var minified = new CleanCSS().minify(source).styles;
console.log(minified);