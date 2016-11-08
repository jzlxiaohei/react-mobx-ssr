import createAjax from 'core/createAjaxInstance';

export default createAjax({
  instance: {
    baseURL: 'http://localhost:3333/api/',
  },
});