module.exports = (sequelize, DataTypes) => {
  return sequelize.define("DayCount", {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      primaryKey: true,
      autoIncrement:true
    },
    start_block: DataTypes.BIGINT,
    end_block: DataTypes.BIGINT,
    tx_count: DataTypes.BIGINT,
    tx_count_data: DataTypes.TEXT,
    block_count: DataTypes.BIGINT,
    new_adress: DataTypes.BIGINT,
    new_etp: DataTypes.BIGINT,
    volume: DataTypes.STRING,
    volume_data: DataTypes.TEXT,
    all_address: DataTypes.BIGINT,
    avg_difficulty: DataTypes.STRING,
    avg_rate: DataTypes.STRING,
    update_time: DataTypes.DATE,
    date: DataTypes.DATE
  },{
    tableName: 'day_count',
  });
}