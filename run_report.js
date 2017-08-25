const path = require('path');
const dayLoop = require('./server/script/day_count');

const dbpath = path.join(__dirname, './server//data');
const uri = `nedb://${dbpath}`;
connect(uri).then(async (db) => {
  dayLoop();
});