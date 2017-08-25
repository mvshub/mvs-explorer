const moment = require('moment');
const utils = require('../utils');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const DayCount = require('../models/DayCount');
const connect = require('camo').connect;

const data = require('../data/_db.json').data;

const dbpath = path.join(__dirname, '../data');
const uri = `nedb://${dbpath}`;


connect(uri).then(async (db) => {
  for(var i=0; i < data.length;i++) {
    delete data[i].id;
    console.log('add::');
    data[i].tx_count_data = JSON.stringify(data[i].tx_count_data);
    data[i].volume_data = JSON.stringify(data[i].volume_data);
    const res = await DayCount.create(data[i]).save();
    console.log(res);
  }
});