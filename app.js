const Koa = require('koa');
const Pug = require('koa-pug');
const router = require('./server/router');
const staticServer = require('koa-static');
const Mvs = require('mvs-rpc');
const db = require('./server/models');
const koaBody = require('koa-body');
const config = require('./server/config');
const Lang = require('./server/lang');
const sqlite3 = require('sqlite3').verbose();

const app = new Koa();

// 加载数据库
db(app);

//sqlite
const sqliteDb = new sqlite3.Database('./server/data/mymvs.db');
sqliteDb.serialize(function() {
  app.sqliteDb = sqliteDb;
});

// 映射语言
app.use(async (ctx, next) => {
  let lang = 'en';
  if (ctx.headers.lang) {
    lang = ctx.headers.lang;
  } else if (ctx.headers['accept-language'] && ctx.headers['accept-language'].indexOf('zh') > -1) {
    lang = 'zh';
  }
  ctx.lang = Lang[lang];
  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    if (ctx.url.indexOf('/api/') == 0) {
      ctx.status = 200;
      console.log(ctx.lang);
      ctx.body = {
        msg: ctx.lang.serverError
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
    isDev: process.env.NODE_ENV === 'development'
  },
  viewPath: './server/views/'
});
pug.use(app);

app.use((ctx, next) => {
  if (ctx.url.indexOf('/api/') == 0) {
    return next();
  }
  ctx.render('index', {
      pageTitle: ctx.lang.pageTitle,
      description: ctx.lang.description,
      config
  });
  return next();
});

app.use(router.routes());

app.listen(3080, () => {
  console.log('server listening port 3080');
});

// 运行统计任务, 每天1-2点之间执行
if (config.schedule) {
  const dayLoop = require('./server/script/day_count');
  // const sched = later.parse.recur().on(config.schedule).time();
  // later.setInterval(dayLoop, sched);
  setInterval(() => {
    const time = new Date();
    const hour = time.getHours();
    if (hour == 1) {
      dayLoop();
    }
  }, 1000 * 60 * 60);
}

// 每个10分钟运行地址统计
const topCount = require('./server/script/top_count');
setInterval(() => {
  topCount();
}, 1000 * 60 * 60);
