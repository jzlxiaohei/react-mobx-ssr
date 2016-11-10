/**
 * loadPath: string for components path ,based by 'src/pages'.
 *      required. very important for isomorphic render .
 *
 * component: react component, for load static, if not provide, load dynamically.
 *
 *
 */
const routes = [
  {
    path: '/',
    loadPath: 'home/Home',
  },
  {
    path: '/about',
    loadPath: 'about/About',
  },
];

export default routes;
