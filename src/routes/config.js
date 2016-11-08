/**
 * loadPath: string for components path ,based by 'src/pages', for load dynamic
 *
 * component: react component, for load static.
 *
 * prefer `loadPath` for webpack code split.
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
