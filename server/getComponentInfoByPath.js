import React from 'react';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import { createLocation } from 'history/LocationUtils';
import { resolveComponentByRoute } from '../src/infrastructure/router'

async function getInfoByPath(reqPath, routes) {
  const location = createLocation(reqPath);
  const routeInfo = await resolveComponentByRoute(routes, location);
  const component = routeInfo.component;
  const { params }  = routeInfo.props;
  let reactContent = '', stores = null;
  if (component.fetchInitData) {
    stores = component.getInitStoreProps();
    await component.fetchInitData({
      stores,
      params,
      location
    });
    reactContent = ReactDOMServer.renderToString(React.createElement(component.wrappedComponent, _.assign({
      params,
      location
    }, stores)));

  } else {
    reactContent = ReactDOMServer.renderToString(React.createElement(component, {
      params,
      location
    }));
  }
  return {
    pageName: component.pageName,
    pageJsPath: component.$pageJsPath,
    cssContent: component.$css,
    initData: {[component.pageName]:stores},
    reactContent,
    loadPath: routeInfo._originRouteConfig.loadPath
  };
}

export default getInfoByPath