const Mvs = require('mvs-rpc');
const moment = require('moment');
const utils = require('../utils');
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

const config = require('../config');
const DayCount = require('../models/DayCount');
const connect = require('camo').connect;


const mvs = new Mvs(config.rpcServer);


let result = {};

const loopBlock = async (height) => {
    const header = await mvs.heightHeader(height);
    const block = await mvs.block(header.hash);
    const txs = block.txs.transactions;
    const details = block.header.result;
    const res = {
        tx_count: parseInt(details.transaction_count) - 1,
        new_etp: 0,
        new_adress: 0,
        volume: 0, // 转账额
        all_address: 0, // 累计总地址
        avg_difficulty: parseInt(details.bits), // 难度
        rate: 0, // 算力
        volume_data: {}, // 交易量详情
        tx_count_data: {}, // 交易笔数，详情
        date: new Date(parseInt(`${details.time_stamp}000`, 10)),
        address: []
    };
    res.day = moment(res.date).format('YYYY-MM-DD');
    console.log(height);
    const today = moment().format('YYYY-MM-DD');
    txs.map(item => {
        const tx = utils.convertTx(item);
        if (utils.isRewardTx(tx)) {
            // console.log('奖励: ', utils.countTransferAmount(tx));
        } else {
            const ts = utils.countTransferAmount(tx);
            res.volume_data = ts;
            res.volume += ts.etp || 0;
            const countObj = {};
            Object.keys(ts).forEach(key => countObj[key] = 1);
            utils.plusObject(res.tx_count_data, countObj);
        }
    });

    if (!result.day) {
        result = Object.assign({}, res);
        result.start_block = height;
        if (res.day == today) {
            console.log('is today!')
            return;
        }
        loopBlock(height + 1);
    } else if (result.day === res.day) {
        // 累加
        result.tx_count += res.tx_count;
        result.new_etp += res.new_etp;
        result.new_adress += res.new_adress;
        result.volume += res.volume;
        result.all_address += res.all_address;
        result.avg_difficulty += res.avg_difficulty;
        result.new_etp += res.new_etp;
        result.end_block = height;
        // 计算不同资产类型的交易量
        utils.plusObject(result.volume_data, res.volume_data);
        utils.plusObject(result.tx_count_data, res.tx_count_data);

        loopBlock(height + 1);
    } else {
        // 保存上一天的数据;
        result.block_count = result.end_block - result.start_block + 1;
        result.avg_difficulty = parseInt(result.avg_difficulty / result.block_count);
        result.tx_count_data = JSON.stringify(result.tx_count_data);
        result.volume_data = JSON.stringify(result.volume_data);
        result.volume = '' + result.volume;
        result.avg_difficulty = '' + result.avg_difficulty
        result.update_time = new Date();
        result.date = result.day; //new Date().format('YYYY-MM-DD');
        console.log('一天的数据完了：', result);

        fs.writeFileSync(path.join(__dirname, './step.json'), JSON.stringify(result));

        await DayCount.create(result).save();

        // 到了当天的块则停止
        if (res.day == today) {
            console.log('is today!')
            return;
        }
        // 开始下一天数据
        result = Object.assign({}, res);
        result.start_block = height;
        loopBlock(height + 1);
    }
};

module.exports = (db) => {
    result = {};
    let stepLog = fs.readFileSync(path.join(__dirname, './step.json'), 'utf-8');
    stepLog = JSON.parse(stepLog);
    loopBlock(stepLog.end_block + 1);
}