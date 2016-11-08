import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { resolveComponentByRoute } from './infrastructure/router';
import history from './utils/history';
import routes from './routes/config';
import loadPage from './loadPage';
import wrapRouteWithLoadPage from './routes/wrapRouteWithLoadPage';
import './importCommon';

wrapRouteWithLoadPage(routes, loadPage);
const container = document.getElementById('root');

function renderComponent(component, props) {
  ReactDOM.render((
    <AppContainer>
      {React.createElement(component, props)}
    </AppContainer>
  ), container);
}

function render(location) {
  resolveComponentByRoute(routes, location)
    .then(routeInfo => renderComponent(routeInfo.component, routeInfo.props))
    .catch((err) => {
      renderComponent(() => <div>404</div>);
      throw err;
    });
}

history.listen(render);

render(history.location);
