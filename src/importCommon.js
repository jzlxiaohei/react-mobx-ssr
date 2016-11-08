// pages里面代码全是通过bundle-loader加载，
// 如果package只出现在pages里的webpack 会把这些package 打包到每个 pageJs里。
// @see https://github.com/webpack/webpack/issues/162
//
// 一些确认会被每个页面公用的包，先在这里import, 这样就避免了上面的问题

import 'mobx';
import 'mobx-react';
import 'comps/Link';
import 'infra/injectStore';
import 'core/makeObservable';
import 'core/BaseModel';
import './utils/ajax';
import './layout/Layout';