const Mvs = require('mvs-rpc');
const moment = require('moment');
const utils = require('../utils');
const fs = require('fs');
const path = require('path');

const config = require('../config');

const mvs = new Mvs(config.rpcServer);

mvs.listassets().then(res => {
  let obj = {};
  res.forEach(item => {
    obj[item.symbol] = parseInt(item.decimal_number, 10);
    return obj;
  });
  obj['etp'] = 8;
  obj = JSON.stringify(obj);
  fs.writeFileSync('../../front/utils/asset-config.js', `export default ${obj};`);
});