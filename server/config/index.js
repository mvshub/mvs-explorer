const versionConfig = require('./version.json');

const config = {
  rpcServer: 'http://localhost:8820/rpc', //mvs钱包rpc服务
  cdn: '', // cdn文件路径,
  schedule: true,
  freeAccount: {
    accont: 'free',
    password: 'free-send',
    address: 'MHkaD2y8eEvTNygGwt9qKZrjDYsU93utNz'
  }
};

Object.assign(config, versionConfig);

module.exports = config;
