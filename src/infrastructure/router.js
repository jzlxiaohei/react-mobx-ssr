// learn ( copy ) a lot from https://github.com/kriasoft/react-static-boilerplate/blob/master/core/router.js

import pathToRegexp from 'path-to-regexp';
import qs from 'query-string';

function decodeParam(val) {
  if (!(typeof val === 'string' || val.length === 0)) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${val}'`;
      err.status = 400;
    }

    throw err;
  }
}


/* eslint-disable no-param-reassign*/
function matchURI(route, path) {
  const keys = [];
  route.pattern = route.pattern || pathToRegexp(route.path, keys);
  route.keys = route.keys || keys;
  const match = route.pattern.exec(path);

  if (!match) {
    return null;
  }

  const params = Object.create(null);

  for (let i = 1; i < match.length; i += 1) {
    params[route.keys[i - 1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }

  return params;
}

function getCurrentRoute(routes, pathname) {
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const params = matchURI(route, pathname);
    if (params) {
      return {
        route,
        params,
      };
    }
  }
  return null;
}

// Find the route matching the specified location return { component, props }
// routeInfo: .load function for get component async or .component
function resolveComponentByRoute(routes, location) {
  const routeInfo = getCurrentRoute(routes, location.pathname);

  if (routeInfo) {
    const { route, params } = routeInfo;
    location.query = qs.parse(location.search);
    const props = {
      params,
      location,
    };

    if (route.load) {
      return route.load().then((component) => {
        return {
          component,
          props,
          _originRouteConfig: route,
        };
      });
    }
    return Promise.resolve({
      component: route.component,
      props,
      _originRouteConfig: route,
    });
  }

  return Promise.reject(404);
}

export { resolveComponentByRoute, getCurrentRoute };