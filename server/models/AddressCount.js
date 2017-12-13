const Document = require('camo').Document;

class AddressCount extends Document {
  constructor() {
    super();
    this.schema({
        address_count: {
            type: Number,
            required: false
        },
        supply: {
            type: Number,
            required: false
        },
        frozen: {
            type: Number,
            required: false
        },
        end_block: {
            type: Number,
            required: false
        },
        top100: {
            type: Number,
            required: false
        },
        top1000: {
            type: Number,
            required: false
        },
        above1w: {
            type: Number,
            required: false
        },
        above1k: {
            type: Number,
            required: false
        },
        above100: {
            type: Number,
            required: false
        }
    });
  }
}

module.exports = AddressCount;
