/* eslint-disable import/no-dynamic-require */
// function loadPageClient(pageName) {
//   return new Promise((resolve) => {
//     const pageBundle = require(`bundle?name=[name]!../pages/${pageName}`);
//     pageBundle(page => resolve(page.default || page));
//   });
// }

/* eslint-disable  no-param-reassign */
function wrapWithLoadPage(routes, loadPage) {
  routes.forEach((route) => {
    if (route.loadPath) {
      route.load = () => {
        return loadPage(route.loadPath);
      };
    }
  });
}

export default wrapWithLoadPage;