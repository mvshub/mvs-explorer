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
    db.each(`select * from address_value where address=? limit 1`, address, (err, row) => {
      if (err) {
        rej(err);
        return;
      }
      res(row);
    });
  });
}

const addRow = (address, unspent, time) => {
  console.log('add one.')
  const stmt = db.prepare('INSERT INTO address_value VALUES(?, ?, ?)');
  stmt.run([address, unspent, time]);
  stmt.finalize();
}

const updateRow = (address, unspent, time) => {
  console.log('update one.')
  const stmt = db.prepare('UPDATE address_value SET unspent=?, lastime=? where address=?');
  stmt.run([unspent, time, address]);
  stmt.finalize();
}

const loopBlock = async (height) => {
    try{
      const header = await mvs.heightHeader(height);
      const block = await mvs.block(header.hash);
      const address = utils.listTxAddress(block.txs.transactions);
      console.log('>>>>>>>>>>>>height::', height, address.length);
      for(let i=0; i < address.length; i++) {
        const item = address[i];
        const assest = await mvs.balance(item);
        assest.unspent = parseInt(assest.unspent);
        if (assest.unspent > 0) {
          console.log(assest.address, '::::', assest.unspent); 
          const hasAddress = await findAddress(item);
          // console.log('hasAddress::', hasAddress);
          if (hasAddress) {
            updateRow(item, assest.unspent, Date.now());
          } else {
            addRow(item, assest.unspent, Date.now());
          }
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
  db.serialize(() => {
    loopBlock(log.stop_height);
  });
}

start();

function initTable() {
  db.serialize(function() {
    db.run("CREATE TABLE address_value (address TEXT, unspent INTEGER, lastime INTEGER)");
  });
  db.close();
}

function test() {
  db.serialize(function() {
    db.each('select * from address_value limit 1', (err, row) => {
      console.log(row);
    });
  });
  db.close();
}

// test();
// initTable();