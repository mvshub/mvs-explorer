const config = require('../config');
const utils = require('../utils');
const moment = require('moment');
const request = require('request-promise-native');
const assetsConfig = require('../config/assets');
const reCAPTCHA = require('recaptcha2');

const recaptcha = new reCAPTCHA(assetsConfig.recaptcha);

const FreeValues = {
    '1': 20000,
    '2': 30000
}

module.exports = {
    index: async (ctx, next) => {
        ctx.body = 'test';
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
        let cap = '~';
        let volume = '~';
        try {
            const priceRes = await request.get('https://api.coinmarketcap.com/v1/ticker/metaverse', {
                json: true,
                timeout: 1000 * 10
            });
            if (priceRes && priceRes[0]) {
                price = priceRes[0].price_usd;
                cap = priceRes[0].market_cap_usd;
                volume = priceRes[0]['24h_volume_usd'];
            }
        } catch(e) {
            // console.log(e);
        }
        ctx.body = {
            difficult: lastHead.bits,
            rate: lastHead.bits / 32,
            price,
            cap,
            volume
        };
        return next();
    },

    block: async (ctx, next) => {
        const id = ctx.params.id;
        const details = await ctx.app.mvs.heightHeader(id);
        if (!details) {
            ctx.body = {
                msg: ctx.lang.noBlockFound
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
                msg: ctx.lang.noTx
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

    addressOverview: async(ctx, next) => {
        const id = ctx.params.id;
        const balance = await ctx.app.mvs.callMethod('xfetchbalance', [id]);

        // 计算交易记录数
        let txRes;
        let txCount = 0;
        const start = Date.now();
        const pageItems = 100;
        try {
            txRes = await ctx.app.mvs.callMethod('listtxs', ['-i', 1, '-l', pageItems, '-a', id, config.freeAccount.accont, config.freeAccount.password]);
        } catch(e) {
            console.log(e);
        }
        if (txRes) {
            txRes = await ctx.app.mvs.callMethod('listtxs', ['-i', txRes.total_page, '-l', pageItems, '-a', id, config.freeAccount.accont, config.freeAccount.password]);
            txCount = (parseInt(txRes.total_page, 10) - 1) * pageItems + parseInt(txRes.transaction_count, 10);
        }

        // 获取其它资产
        let assests = [];
        if (txCount < 1000) {
            assests = await ctx.app.mvs.addressAsset(id);
        }

        ctx.body = {
            result: {
                time: Date.now() - start,
                details: balance.balance,
                assests,
                txCount
            }
        }; 
        
        return next();
    },

    addressTx: async(ctx, next) => {
        const id = ctx.params.id;
        const page = ctx.query.page || 1;
        let res;
        try {
            res = await ctx.app.mvs.callMethod('listtxs', ['-i', page, '-l', 100, '-a', id, config.freeAccount.accont, config.freeAccount.password]);
        } catch(e) {
            console.log(e);
        }

        if (!res) {
            ctx.body = {
                msg: ctx.lang.noTxHistory
            }; 
            return next();
        }

        const list = res.transactions;
        const totalPage = parseInt(res.total_page, 10);
        list.sort((i1, i2) => parseInt(i2.height, 10) - parseInt(i1.height, 10));
        const pageList = [];
        for(let i = 0; i < list.length; i++) {
            const item = list[i];
            const txDetail = await ctx.app.mvs.tx(item.hash);
            const blockDetail = await ctx.app.mvs.heightHeader(item.height);
            if (blockDetail) {
                txDetail.time_stamp = blockDetail.time_stamp;
                txDetail.block_height = item.height;
            }
            pageList.push(utils.convertTx(txDetail));
        }
        ctx.body = {
            result: {
                page,
                totalPage: totalPage,
                txCount: pageList.length,
                pageItems: 100,
                txs: pageList
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
    },

    freeSend: async(ctx, next) => {
        const body = ctx.request.body;
        console.log('send......................')
        console.log(body);
        if (!body.captcha) {
            ctx.body = {
                msg: Math.random() * 10000
            };
            return next();
        }
        try {
            const validate = await recaptcha.validate(body.captcha);
            const freeAccount = config.freeAccount;
            if (!body.value) {
                body.value = '1';
            }
            const { lastFreeTime, freeHistory } = ctx.app;
            // 至少隔10s才能发放一笔
            if (lastFreeTime && Date.now() - lastFreeTime < 10000) {
                ctx.body = {
                    msg: ctx.lang.hasSendRecently
                };
                return next();
            }
            // 记录本地执行领取的时间
            ctx.app.lastFreeTime = Date.now();
            const balance = await ctx.app.mvs.balance(body.address);
            if (balance.unspent > 10000) {
                ctx.body = {
                    msg: ctx.lang.haveBalance
                };
                return next();
            }
            const res = await ctx.app.mvs.callMethod('send', [
                freeAccount.accont,
                freeAccount.password,
                body.address,
                FreeValues[body.value]
            ]);
            ctx.body = {
                data: body,
                transaction: res.transaction
            };
            if (!freeHistory) {
                ctx.app.freeHistory = [];
            }
            ctx.app.freeHistory.push({
                address: body.address,
                value: FreeValues[body.value],
                time: Date.now()
            });
            if (ctx.app.freeHistory.length > 50) {
                ctx.app.freeHistory.shift();
            }
            return next();
        } catch(e) {
            ctx.body = {
                msg: 'validate error.'
            };
            return next();
        }
    },

    freeHistory: async(ctx, next) => {
        const balance = await ctx.app.mvs.balance(config.freeAccount.address);
        ctx.body = {
            data: {
                balance: balance.unspent,
                history: ctx.app.freeHistory ? ctx.app.freeHistory.reverse() : []
            }
        };
        return next();
    }
};
