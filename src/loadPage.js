/* eslint-disable import/no-dynamic-require */

function loadPageClient(pageName) {
  return new Promise((resolve) => {
    const pageBundle = require(`bundle?name=pages/[path][name]&context=src/pages!./pages/${pageName}`);
    pageBundle(page => resolve(page.default || page));
  });
}

export default loadPageClient;