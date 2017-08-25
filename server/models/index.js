const fs = require('fs');
const path = require('path');
const connect = require('camo').connect;
const models = {
    DayCount: require('./DayCount')
};

module.exports = function (app) {
  const dbpath = path.join(__dirname, '../data');
  const uri = `nedb://${dbpath}`;
  app.models = models;
  return connect(uri).then(function (db) {
      app.db = db;
      app.dbReady = true;
      app.emit('dbready', db);
  });
};