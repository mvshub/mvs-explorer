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

function test() {
  db.serialize(function() {
    // db.each('select count(*) from address_value', (err, row) => {
    //   console.log(row);
    //   // console.log(row.address + '   >>>>    ' + Math.ceil(row.unspent / 100000000) );
    // });
    db.each('select sum(frozen) from address_value', (err, row) => {
      console.log(row)
    });

    db.each('select sum(unspent) from address_value', (err, row) => {
      console.log(row)
    });
  });
  db.close();
}

test();

// 截止：783980

// 总量：53607832
// 锁仓：9951302

// ico: 5千万
// pow: 50w*3 + 283980 * 2.85 = 2309343
// pos: 1298489