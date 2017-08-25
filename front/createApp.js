import dva from 'dva';
import createLoading from 'dva-loading';

import appModel from './models/app';

export default (opts) => {
  const app = dva(opts);

  app.use(createLoading({ effects: true }));

  app.model(appModel);

  return app;
};
