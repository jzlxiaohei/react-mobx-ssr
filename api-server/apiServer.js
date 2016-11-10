import express from 'express';
import httpProxy from "http-proxy";
import cors from 'cors';

const app = express();
const apiProxy = httpProxy.createProxyServer();

app.use(cors());

app.use(function (req, res) {
  var originalUrl = req.originalUrl;
  if (originalUrl.indexOf('?') > -1) {
    originalUrl += '&'
  }
  return apiProxy.web(req, res, {
    prependPath: false,
    target: 'https://www.v2ex.com' + originalUrl,
    changeOrigin: true
  })
});

app.listen(3333,function () {
  console.log('api server listen on 3000')
});

