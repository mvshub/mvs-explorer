const config = require('../config');
const utils = require('../utils');
const moment = require('moment');
const request = require('request-promise-native');
const assetsConfig = require('../config/assets');

module.exports = {
    index: async (ctx, next) => {
        // console.log(0)
        // const res = await ctx.app.mvs.heightHeader(374879);
        // console.log(res);
        // const res = await ctx.app.mvs.balance('MBmaAn2zpTC8GRkNLa6smCMvtAhbYF8EBo');
        // const res = await ctx.app.mvs.height();
        // const res = await ctx.app.mvs.history('MKJutYPKjwmjg8PRPgmxB27LtiXWY6pPJ6');

        // const res = await ctx.app.mvs.tx('0f8cdfbd725d61a75683d3479cbad4d50e5a9d6665aacd78e37d0102a5e6550a');

        ctx.body = res;
        return next();
    },

    latest: async (ctx, next) => {
        const list = [];
        const lastHeight = await ctx.app.mvs.height();
        let lastHead = await ctx.app.mvs.heightHeader(lastHeight);
        let lastBlock = await ctx.app.mvs.block(lastHead.hash);
        list.push(lastBlock.header.result);
        let i = 1;
        while(i < 10) {
            const block = await ctx.app.mvs.block(lastHead.previous_block_hash);
            list.push(block.header.result);
            lastHead = block.header.result;
            i++;
        }
        ctx.body = {
            result: list
        };
        return next();
    },
    current: async (ctx, next) => {
        const lastHeight = await ctx.app.mvs.height();
        let lastHead = await ctx.app.mvs.heightHeader(lastHeight);
        let price = '~';
        try {
            const priceRes = await request.get('https://szzc.com/api/public/tickers', {
                json: true,
                timeout: 1000 * 10
            });
            if (priceRes && priceRes.status && priceRes.status.success === 1) {
                price = priceRes.result.filter(item => item.market === 'ETPCNY')[0].last;
            }
        } catch(e) {
            console.log(e);
        }
        ctx.body = {
            difficult: lastHead.bits,
            rate: lastHead.bits / 14.4,
            price: price
        };
        return next();
    },

    block: async (ctx, next) => {
        const id = ctx.params.id;
        const details = await ctx.app.mvs.heightHeader(id);
        if (!details) {
            ctx.body = {
                msg: '没有找到区块'
            }
        } else  {
            const block = await ctx.app.mvs.block(details.hash);
            const txs = block.txs.transactions;
            txs.forEach(item => {
                utils.convertTx(item);
            })
            ctx.body = {
                result: {
                    details: block.header.result,
                    txs
                }
            }
        }
        return next();
    },

    tx: async (ctx, next) => {
        const id = ctx.params.id;
        const tx = await ctx.app.mvs.tx(id);

        if (!tx) {
            ctx.body = {
                msg: '未查询到交易'
            };
        } else {
            console.log(tx);
            ctx.body = {
                tx,
                result: utils.convertTx(tx)
            };   
        }
        
        return next();
    },

    address: async(ctx, next) => {
        const id = ctx.params.id;

        const balance = await ctx.app.mvs.balance(id);
        const tx = await ctx.app.mvs.history(id);
        if (!tx) {
            ctx.body = {
                msg: '未查询到该地址信息'
            }; 
            return next();
        }
        const list = [];
        const hasMap = [];
        tx.forEach(item => {
            if (item.received && !hasMap[item.received.hash]) {
                list.push(item.received);
                hasMap[item.received.hash] = true;
            }
            if (item.spent && !hasMap[item.spent.hash]) {
                list.push(item.spent);
                hasMap[item.spent.hash] = true;
            }
        });
        list.sort((i1, i2) => parseInt(i2.height, 10) - parseInt(i1.height, 10));
        const pageList = [];
        const page = parseInt(ctx.query.page, 10) || 1;
        const start = (page - 1) * 10;
        for(let i = 0; i < 10; i++) {
            const item = list[start + i];
            if (item) {
                const txDetail = await ctx.app.mvs.tx(item.hash);
                const blockDetail = await ctx.app.mvs.heightHeader(item.height);
                if (blockDetail) {
                    txDetail.time_stamp = blockDetail.time_stamp;
                    txDetail.block_height = item.height;
                }
                pageList.push(utils.convertTx(txDetail));
            }
        }
        balance.transactions = list.length;

        // 其它资产列表
        const assests = await ctx.app.mvs.addressAsset(id);
        ctx.body = {
            result: {
                details: balance,
                page,
                txs: pageList,
                assests
            }
        }; 
        
        return next();
    },

    assets:  async(ctx, next) => {
        const res = await ctx.app.mvs.listassets();
        res.forEach(item => {
            if (assetsConfig[item.symbol]) {
                Object.assign(item, assetsConfig[item.symbol]);
            }
        })
        ctx.body = {
            assets: [
                {symbol: 'ETP', name: '熵', maximum_supply: '100000000', site: 'http://mvs.live'}
            ].concat(res)
        }; 
        return next();
    },

    dayReport: async(ctx, next) => {
        const day = ctx.query.day || 100;
        const list = await ctx.app.models.DayCount.find({}, {
            limit: parseInt(day),
            sort: '-date'
        });
        list.forEach(item => {
            item.tx_count_data = JSON.parse(item.tx_count_data);
            item.volume_data = JSON.parse(item.volume_data);
            item.date = moment(item.date).format('YYYY-MM-DD');
        });
        ctx.body = {
            data: list.reverse()
        };
        return next();
    }
};
