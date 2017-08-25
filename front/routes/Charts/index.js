import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Radio } from 'antd';
import * as Api from '@/service';
import { moment, formatTime, formatAssetValue } from '@/utils';
import createG2 from 'g2-react';
import { Stat } from 'g2';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import './style.less';

const plotCfg = {
  margin: [10, 100, 50, 120],
};

const TxCountLine = createG2(chart => {
  chart.line().position('date*tx_count');
  chart.col('date', {
    alias: '日期',
    nice: false,
  }).col('tx_count', {
    alias: '交易笔数'
  });
  chart.render();
});

const TxVolumeLine = createG2(chart => {
  chart.line().position('date*volume');
  chart.col('date', {
    alias: '日期',
    nice: false,
  }).col('volume', {
    alias: '转账金额',
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
    alias: '日期',
    nice: false,
  }).col('block_count', {
    alias: '块数量'
  });
  chart.render();
});

const AvgDifficultyLine = createG2(chart => {
  chart.line().position('date*avg_difficulty');
  chart.col('date', {
    alias: '日期',
    nice: false,
  }).col('avg_difficulty', {
    alias: '难度',
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
            <RadioButton value="100">100天</RadioButton>
            <RadioButton value="60">60天</RadioButton>
            <RadioButton value="30">30天</RadioButton>
            <RadioButton value="7">7天</RadioButton>
          </RadioGroup>
        </div>
        <h3>交易笔数</h3>
        <TxCountLine
          data={state.chartData}
          forceFit
          height={300}
          plotCfg={plotCfg}
        />

        <h3>转账金额(ETP)</h3>
        <TxVolumeLine
          data={state.chartData}
          height={300}
          forceFit
          plotCfg={plotCfg}
        />

        <h3>平均难度</h3>
        <AvgDifficultyLine
          data={state.chartData}
          height={300}
          forceFit
          plotCfg={plotCfg}
        />

        <h3>每天块数</h3>
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