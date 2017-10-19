import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Radio } from 'antd';
import * as Api from '@/service';
import { moment, formatTime, formatAssetValue } from '@/utils';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import Lang from '@/lang';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import './style.less';

const plotCfg = {
  margin: [10, 100, 50, 120],
};

const TxCountLine = createG2(chart => {
  chart.line().position('date*tx_count');
  chart.col('date', {
    alias: Lang.Charts.date,
    nice: false,
  }).col('tx_count', {
    alias: Lang.Charts.txCount
  });
  chart.render();
});

const TxVolumeLine = createG2(chart => {
  chart.line().position('date*volume');
  chart.col('date', {
    alias: Lang.Charts.date,
    nice: false,
  }).col('volume', {
    alias: Lang.Charts.volume,
    nice: false,
    tickInterval: 10000
  });
  chart.axis('volume', {
    formatter: function(val) {
      if (val > 0) {
        return (val/10000);
      }
    }
  });
  chart.render();
});

const BlockCountLine = createG2(chart => {
  chart.line().position('date*block_count');
  chart.col('date', {
    alias: Lang.Charts.date,
    nice: false,
  }).col('block_count', {
    alias: Lang.Charts.blockCount
  });
  chart.render();
});

const AvgDifficultyLine = createG2(chart => {
  chart.line().position('date*avg_difficulty');
  chart.col('date', {
    alias: Lang.Charts.date,
    nice: false,
  }).col('avg_difficulty', {
    alias: Lang.Charts.difficulty,
    nice: false,
    tickInterval: 1000000000000
  });
  chart.axis('avg_difficulty', {
    formatter: function(val) {
      if (val > 0) {
        return parseInt(val/1000000000000);
      }
    }
  });
  chart.render();
});

export default class Charts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      day: '100'
    };
    this.loadLineChart();
    this.tabChange = this.tabChange.bind(this);
  }
  loadLineChart() {
    Api.getLatesChart(this.state.day).then(res => {
      res.data.forEach(item => {
        item.volume = parseInt(formatAssetValue(item.volume, 'etp'));
        item.avg_difficulty = parseInt(item.avg_difficulty);
      });
      this.setState({
        loading: false,
        chartData: res.data
      });
    });
  }
  tabChange(e) {
    this.setState({
      day: e.target.value
    }, () => this.loadLineChart());
  }
  render() {
    const state = this.state;

    if (state.loading) {
      return <div style={{ textAlign: 'center' }}><Spin /></div>;
    }
    return (
      <div className="charts-page">
        <div className="charts-tab">
          <RadioGroup defaultValue="100" size="large" value={state.day} onChange={this.tabChange}>
            <RadioButton value="100">100{Lang.Charts.day}</RadioButton>
            <RadioButton value="60">60{Lang.Charts.day}</RadioButton>
            <RadioButton value="30">30{Lang.Charts.day}</RadioButton>
            <RadioButton value="7">7{Lang.Charts.day}</RadioButton>
          </RadioGroup>
        </div>
        <h3>{Lang.Charts.txCount}</h3>
        <TxCountLine
          data={state.chartData}
          forceFit
          height={300}
          plotCfg={plotCfg}
        />

        <h3>{Lang.Charts.volume}(ETP)</h3>
        <TxVolumeLine
          data={state.chartData}
          height={300}
          forceFit
          plotCfg={plotCfg}
        />

        <h3>{Lang.Charts.avgDifficulty}</h3>
        <AvgDifficultyLine
          data={state.chartData}
          height={300}
          forceFit
          plotCfg={plotCfg}
        />

        <h3>{Lang.Charts.blockOneDay}</h3>
        <BlockCountLine
          data={state.chartData}
          height={300}
          forceFit
          plotCfg={plotCfg}
        />
      </div>
    );
  }
}