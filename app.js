const Koa = require('koa');
const Pug = require('koa-pug');
const router = require('./server/router');
const staticServer = require('koa-static');
const Mvs = require('mvs-rpc');
const db = require('./server/models');
const koaBody = require('koa-body');
const later = require('later');
const config = require('./server/config');

const app = new Koa();

// 加载数据库
db(app);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    if (ctx.url.indexOf('/api/') == 0) {
      ctx.status = 200;
      ctx.body = {
        msg: '服务器异常'
      };
    }
    ctx.app.emit('error', err, ctx);
  }
});

app.use(koaBody());

app.mvs = new Mvs(config.rpcServer);

app.use(staticServer('./dist/'));

const pug = new Pug({
  pretty: true,
  locals: {
    
  },
  viewPath: './server/views/'
});
pug.use(app);

app.use((ctx, next) => {
  if (ctx.url.indexOf('/api/') == 0) {
    return next();
  }
  ctx.render('index', {
      title: 'MyMVS',
      config
  });
  return next();
});

app.use(router.routes());

app.listen(3080, () => {
  console.log('server listening port 3080');
});

// 运行统计任务
if (config.schedule) {
  const dayLoop = require('./server/script/day_count');
  const sched = later.parse.recur().on('01:00:00').time();
  later.setInterval(dayLoop, sched);
}
