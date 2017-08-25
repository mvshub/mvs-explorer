const Mvs = require('mvs-rpc');
const moment = require('moment');
const utils = require('../utils');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

const stepLog = require('./top_step.json');
const config = require('../config');

const mvs = new Mvs(config.rpcServer);

let result = stepLog;
let minAddress = null;
let minValue = 0;

const loopBlock = async (height) => {
    try{
      const header = await mvs.heightHeader(height);
      const block = await mvs.block(header.hash);
      const address = utils.listTxAddress(block.txs.transactions);
      address.forEach(async (item) => {
        if (!result[item]) {
          const assest = await mvs.balance(item);
          // console.log(assest);
          if (parseInt(assest.unspent) > 0) {
            result[item] = assest.unspent;
            console.log('find one:', item, assest.unspent)
          }
        }
        console.log('all address::', Object.keys(result).length, height);
      });
      loopBlock(height + 1);
    } catch(e) {
      console.log(e);
      fs.writeFileSync(path.join(__dirname, './top_step.json'), JSON.stringify(result));
    }
};

module.exports = (start) => {
    // result = {};
    // max = {};
    // min = {};
    // loopBlock(stepLog.end_block + 1);
    loopBlock(start);
}