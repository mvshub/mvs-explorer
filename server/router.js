const Router = require('koa-router');
const api = require('./controller/api');

const router = new Router();

router.get('/api/latest', api.latest);
router.get('/api/current', api.current);
router.get('/api/block/:id', api.block);
router.get('/api/tx/:id', api.tx);
router.get('/api/address-tx/:id', api.addressTx);
router.get('/api/address/:id', api.addressOverview);
router.get('/api/assets', api.assets);
router.post('/api/free-send', api.freeSend);
router.get('/api/free-history', api.freeHistory);
router.get('/api/dayreport', api.dayReport);
router.get('/api/topoverview', api.topOverview);
router.get('/api/toplist', api.topList);
router.get('/api/toprank', api.topRank);
router.get('/api/test', api.index);

module.exports = router;
