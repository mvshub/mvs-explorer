import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';

import App from './routes/App';
import Index from './routes/Index';
import Block from './routes/Block';
import Transaction from './routes/Transaction';
import Address from './routes/Address';
import Assets from './routes/Assets';
import Charts from './routes/Charts';
import Free from './routes/Free';
import RichList from './routes/RichList';

const route = <Route path="/" component={App}>
  <Route path="index" component={Index} />
  <Route path="block/:id" component={Block} />
  <Route path="tx/:id" component={Transaction} />
  <Route path="address/:id" component={Address} />
  <Route path="assets" component={Assets} />
  <Route path="charts" component={Charts} />
  <Route path="free" component={Free} />
  <Route path="rich" component={RichList} />
  <Route path="*" component={Index} />
</Route>;

export const routes = (
  <div>{route}</div>
);

export default ({ history }) => (
  <Router history={history}>{route}</Router>
);
