# MVS区块浏览器
[www.mymvs.info](http://www.mymvs.info)

## 环境配置

```
yarn install
或
npm install
```
安装pm2

```
npm -g install pm2
```

配置RPC钱包服务

server/config/index.js

```
rpcServer: 'http://localhost:8820/rpc'
```

## 本地开发

启动api server: http://localhost:3080
```
npm run server
```

启动 webpack dev server: http://localhost
```
npm run dev
```

##  线上部署

构建前端代码
```
npm run dll
npm run release
```
前端代码js，css会被构建到dis/目录下，正式部署环境访问的为改目录下的代码，可以结合使用cdn将改目录文件上传到cdn服务，修改server/config/index.js文件中cdn的配置路径即可

运行web服务
```
node app.js
或者使用pm2 运行
pm2 start ecosystem.config.js
```

访问页面：http://localhost:3080

## 运行统计任务

本项目统计数据使用nedb的方式，存放在server/data目录下

任务的脚本在server/script目录下

可通过server/config/index.js文件中的字段配置
```
schedule: '01:00:00'
// 默认每天1点运行
//可关闭 schedule = false
```

可手动运行统计脚本
```
npm run report
```

脚本会记录上一次统计的区块高度，从上一次结束的位置开始统计
