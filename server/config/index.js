const versionConfig = require('./version.json');

const config = {
  rpcServer: 'http://localhost:8820/rpc', //mvs钱包rpc服务
  cdn: '', // cdn文件路径,
  schedule: true
};

Object.assign(config, versionConfig);

module.exports = config;
