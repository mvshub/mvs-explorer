const versionConfig = require('./version.json');

const config = {
  rpcServer: 'http://localhost:8820/rpc', //mvs钱包rpc服务
  cdn: '', // cdn文件路径,
  schedule: true,
  freeAccount: {
    accont: 'free',
    password: 'free-send',
    address: 'MHkaD2y8eEvTNygGwt9qKZrjDYsU93utNz'
  },
  recaptcha: {
    siteKey: '6LeyfTwUAAAAAJZg_3Qz0BjDhXgIXhiBcKaNeMxH',
    secretKey: '6LeyfTwUAAAAALp2E0D_cj4lCKHhbHyTnmdVWjzf'
  }
};

Object.assign(config, versionConfig);

module.exports = config;
