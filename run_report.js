const path = require('path');
const dayLoop = require('./server/script/day_count');
const connect = require('camo').connect;

const dbpath = path.join(__dirname, './server//data');
const uri = `nedb://${dbpath}`;
connect(uri).then(async (db) => {
  dayLoop();
});