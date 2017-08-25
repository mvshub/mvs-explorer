// mysql: 8n)xM)=rVX36[&>

const versionConfig = require('./version.json');

const config = {
  rpcServer: 'http://localhost:8820/rpc', //mvs钱包rpc服务
  cdn: '', // cdn文件路径,
  schedule: '01:00:00' // 每天运行统计任务脚本的时间, null为不运行
};

Object.assign(config, versionConfig);

module.exports = config;
