const Document = require('camo').Document;

class DayCount extends Document {
  constructor() {
    super();
    this.schema({
      start_block: {
          type: Number,
          required: false
      },
      end_block: {
          type: Number,
          required: false
      },
      tx_count: {
          type: Number
      },
      tx_count_data: {
          type: String,
          required: false
      },
      block_count: {
          type: Number,
          required: false
      },
      new_adress: {
          type: Number,
          required: false
      },
      new_etp: {
          type: Number,
          required: false
      },
      volume: {
          type: String,
          required: false
      },
      volume_data: {
          type: String,
          required: false
      },
      all_address: {
          type: Number,
          required: false
      },
      avg_difficulty: {
          type: String,
          required: true
      },
      avg_rate: {
          type: String,
          required: false
      },
      update_time: {
          type: Date,
          required: false
      },
      date: {
          type: String,
          required: false
      }
    });
  }
}

module.exports = DayCount;
