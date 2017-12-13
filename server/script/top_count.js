const Mvs = require('mvs-rpc');
const moment = require('moment');
const utils = require('../utils');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const sqlite3 = require('sqlite3').verbose();
const stepLog = require('./top_step.json');
const config = require('../config');

const mvs = new Mvs(config.rpcServer);
const db = new sqlite3.Database('../data/mymvs.db');

const findAddress = (address) => {
  return new Promise((res, rej) => {
    db.get(`SELECT * from address_value where address=? limit 1 `, address, (err, row) => {
      if (err) {
        rej(err);
        return;
      }
      res(row);
    });
  });
};

const addRow = (address, unspent, frozen, time) => {
  console.log('add one.')
  const stmt = db.prepare('INSERT INTO address_value VALUES(?, ?, ?, ?)');
  stmt.run([address, unspent, frozen, time]);
  stmt.finalize();
}

const updateRow = (address, unspent, frozen, time) => {
  console.log('update one.')
  const stmt = db.prepare('UPDATE address_value SET unspent=?, frozen=?, lastime=? where address=?');
  stmt.run([unspent, frozen, time, address]);
  stmt.finalize();
}

let cacheAddress = {};
let lastCacheHeight = 0;
let lasCacheTime = 0;
const loopBlock = async (height) => {
  // 终止高度
  // if (height > 783636) {
  //   return;
  // }
  try{
    const header = await mvs.heightHeader(height);
    const block = await mvs.block(header.hash);
    const address = utils.listTxAddress(block.txs.transactions);
    console.log('>>>>>>>>>>>>height::', height, address.length);

    //每1w高度记清空一次缓存区域,避免占用过大内存
    if (height - lastCacheHeight > 30000) {
      lastCacheHeight = height;
      cacheAddress = {};
      // console.log('**************************time:', (Date.now() - lasCacheTime) / 1000 / 60);
      lasCacheTime = Date.now();

    }

    //
    for(let i=0; i < address.length; i++) {
      const item = address[i];
      // 在缓存区里的地址直接跳过
      if (cacheAddress[item]) {

      } else {
        const res = await mvs.callMethod('xfetchbalance', [item]);
        const balance = res.balance;
        balance.unspent = Number(balance.unspent);
        balance.frozen = Number(balance.frozen);
        if (balance.unspent > 0) {
          const hasAddress = await findAddress(item);
          // if (!hasAddress) {
          //   addRow(item, balance.unspent, balance.frozen, Date.now());
          // }
          if (hasAddress) {
            updateRow(item, balance.unspent, balance.frozen, Date.now());
          } else {
            addRow(item, balance.unspent, balance.frozen, Date.now());
          }
        }
        cacheAddress[item] = true;
      }
    }
    loopBlock(height + 1);
    fs.writeFileSync(path.join(__dirname, './top_step.json'), JSON.stringify({
      stop_height: height
    }));
  } catch(e) {
    console.log(e);
  }
};

function start() {
  let log = fs.readFileSync(path.join(__dirname, './top_step.json'));
  log = JSON.parse(log);
  lastCacheHeight = log.stop_height;
  lasCacheTime = Date.now();
  db.serialize(() => {
    loopBlock(log.stop_height);
  });
}

start();

function initTable() {
  db.serialize(function() {
    db.run("CREATE TABLE address_value (address TEXT, unspent INTEGER, frozen INTEGER, lastime INTEGER)");
  });
  db.close();
}

// initTable();