import 'babel-polyfill';
import { browserHistory } from 'dva/router';
import { createLogger } from 'redux-logger';
import { message } from 'antd';

import createApp from './createApp';

import router from './router';

const opts = {
  history: browserHistory,
  initialState: window.__INITIAL_STATE__,
  onError(e) {
    message.error(e.message);
  }
};

if (process.env.NODE_ENV !== 'production') {
  opts.onAction = createLogger();
}

const app = createApp(opts);
app.router(router);
app.start('#root');
