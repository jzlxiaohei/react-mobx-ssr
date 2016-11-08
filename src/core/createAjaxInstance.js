import axios from 'axios';

const httpMethods = ['get', 'post', 'put', 'delete'];

function createAjax(instOptions = {}) {
  const instance = instOptions.useInstance || axios.create(instOptions.instance);
  const ajax = {};

  httpMethods.forEach((method) => {
    /* eslint-disable  no-param-reassign */
    ajax[method] = (options) => {
      options.method = method;
      if (method === 'get') {
        options.params = options.data;
      }
      if (options.onBeforeSend) {
        const canContinue = options.onBeforeSend();
        if (canContinue === false) {
          return null;
        }
      }
      return instance.request(options)
        .then((res) => {
          if (options.onSuccess) {
            options.onSuccess(res, options);
          }
          if (options.onComplete) {
            options.onComplete(res, options);
          }
          return res;
        }).catch((err) => {
          if (options.onError) {
            options.onError(err, options);
          }
          if (options.onComplete) {
            options.onComplete(err, options);
          }
          throw err;
        });
    };
  });

  return ajax;
}

export default createAjax;
