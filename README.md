# React 同构工程探讨

##How to run
	
dev:	
	
	yarn install
	npm start

visit [localhost:3333](http://localhost:3333) to dev
	
prod:
	
	npm run json-wp // then the assets files in `dist` , views file in server/views
	npm run api // start api server..
	npm run server
	
visit 

1. [localhost:3000](http://localhost:3000)  to see server render

2. [localhost:3000/fallback](http://localhost:3000/fallback)  for pure static server. (just demo , in production should use nginx server fallback

## 说明
研究了两个星期的`React`同构.脉络已经清晰.因为我的选型，使用了mobx而不是redux。不过其实难点根本不在于使用什么状态管理工具。


### feature
1. 通过配置，可以做到`自动降级`。如果负责渲染的服务器挂了，降级到前端渲染的版本。当然如果你的静态文件服务器也挂了，那谁都没辙。
2. 以每个页面为单位进行 `code split`。
3. 开发时，服务端虽然没有hot-reload，但是刷新即可生效，不用重启dev-server
4. 以客户端为主，最小化对client端代码的影响.（基本就是加了一个 `decorator`)
5. 发布后，每个页面，除了`initData`和由`initData`渲染的react string，这些需要动态请求和生成，其他的静态都资源已经准备好。大致如下面这样

```html
...
        <link rel="stylesheet" type="text/css" href="/assets/common.64b770624e8c9ae0e8b3.css">
        <style> <!--inline page style just for this page--> </style>
        <script>
            window.__mobxInjectedStore={{ initDataStr }} // repalce dynamic by server
        </script>
...
        <div id="root">{{ reactContent }}</div>
      
        <script src="/assets/manifest.3368a90bac5fbd3f8d7e.js"></script>
        <script src="/assets/common.64b770624e8c9ae0e8b3.js"></script>
        <script src="/assets/main.7d8a625831be454a25ed.js"></script>
        <script src="<!-- pageJs just for this page-->"></script>
```
实际上， pageJs是用内嵌的css 代码的，但是不提前写入inline css，会使首屏的内容没有样式，重复了点代码。

目前只有一个技术点还没完全落实，就是组件级的自定义缓存策略。不过通过借鉴 沃尔玛的[实践](https://github.com/electrode-io/electrode-react-ssr-caching), 稍加改造，这部分的基本实现其实有的，不过缓存的策略还需要细化。示意代码如下。

```javascript
const ReactCompositeComponent = require("react/lib/ReactCompositeComponent");

ReactCompositeComponent.Mixin._mountComponent = ReactCompositeComponent.Mixin.mountComponent;

ReactCompositeComponent.Mixin.mountComponent = function(transaction, hostParent, hostContainerInfo, context) {

    let html = '';
    if(this._instance.createCacheKey){
        cosnt key = this._instance.createCacheKey();
        html =	getHtmlFromCache(key); // 遗憾的是，目前看，必须是同步的，因此只能存内存...
    }else{
        html = this._mountComponent(transaction, hostParent, hostContainerInfo, context)
    }
    return html
};
```

当然为了做到这些，需要做很多约定和假设

### 约定
1.除了server，还有一个build的阶段，用来发布production前，编译和准备静态文件，加快线上运行效率

2.所有需要请求首屏数据的的组件，需要加 `@injectStore`,里面主要需要提供 `storeMap`和 `fetchInitData`。 storeMap是给object, key会注入到组件中的props上，value是store的 Class, 具体的实例化，由`injectStore`控制；`fetchInitData`参数是{stores, params, location}返回一个Promise, 我们使用`mobx`,所以可能需要熟悉一下这个状态管理库。

3.资源文件目前只支持 css和scss （添加其他css预处理器很容易）。img 都是直接提供url字符串的，因为图片资源不进入源码管理的，也没法require.样式文件的处理，使用node的 hook `require extensions`

```javascript
function hook(compile, extension) {
  require.extensions[extension] = function (m, filename) {
    const tokens = compile(filename);
    return m._compile('module.exports = ' + JSON.stringify(tokens), filename);
  };
}

function compileSass(filename) {
  const sassContent = sass.renderSync({
    file: filename,
    includePaths: [constants.srcBaseDir]
  });
  return sassContent.css.toString();
}

function outputFileContent(fileName) {
  return fs.readFileSync(fileName).toString();
}

function empty() {
  return ''
}

// TODO postcss
if (constants.isProduction && !constants.isBuild) {
  hook(empty, '.scss');
  hook(empty, '.css');
} else {
  hook(compileSass, '.scss');
  hook(outputFileContent, '.css');
}
```
所以build阶段，`const cssContent = require('xx.scss')` 能直接css的内容，排除掉不在pages里的样式文件，然后注入生成的页面即可。

5.路由不使用`react-router`，使用扁平的配置。一些原因可以看这篇文章 [you-might-not-need-react-router](https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d#.pfxahyshr). 另外因为client和server端都要依赖路由的配置，去做很多处理（code split; 首屏数据的加载等），扁平的配置会容易处理很多.具体的配置见 `src/routes/config.js`.


##TODO

1. refactor code
2. test
3. use in our production env.




