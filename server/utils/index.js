module.exports = {
    convertTx(tx) {
        tx.inputs.forEach(inItem => {
            delete inItem.previous_output;
        });
        tx.outputs.forEach(outItem => {
            const attachment = outItem.attachment;
            if (attachment.type == 'asset-transfer') {
                outItem.asset_name = attachment.symbol;    
                outItem.output_value = parseInt(attachment.quantity, 10);
            } else {
                outItem.asset_name = outItem.attachment.type;
                outItem.output_value = parseInt(outItem.value);
            }
            delete outItem.attachment;
        });
        return tx;
    },
    isRewardTx(tx) {
        // 没有输入地址
        if (!tx.inputs[0].address) {
            return true;
        }
        return false;
    },
    countTransferAmount(tx) {
        const { inputs, outputs } = tx;
        const inputAddress = inputs.map(item => item.address);
        const outTx = outputs.filter(item => !inputAddress.includes(item.address));
        const group = {};
        outTx.forEach(item => {
            if (!group[item.asset_name]) {
                group[item.asset_name] = item.output_value;
            } else {
                group[item.asset_name] += item.output_value;
            }
        });
        return group;
    },
    plusObject(source, value) {
        Object.keys(value).forEach(key => {
            if (!source[key]) {
                source[key] = value[key];
            } else {
                source[key] += value[key];
            }
        });
        return source;
    }
}
