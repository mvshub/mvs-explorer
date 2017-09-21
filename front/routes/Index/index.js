import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Radio } from 'antd';
import * as Api from '@/service';
import { moment, formatTime } from '@/utils';
import createG2 from 'g2-react';
import { Stat } from 'g2';

const Line = createG2(chart => {
  chart.line().position('date*tx_count');
  chart.col('date', {
    alias: '日期',
    nice: false,
  }).col('tx_count', {
    alias: '交易笔数'
  });
  chart.render();
});

import './style.less';

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      loading: true,
      plotCfg: {
        margin: [10, 100, 50, 120],
      }
    };
    this.loadData();
    this.loadLineChart();
  }
  componentWillUnmount() {
    if (this.timmer != undefined) {
      clearTimeout(this.timmer);
    }
  }
  loadData() {
    Api.getLatestBlocks(0).then(res => {
      this.setState({
        loading: false,
        list: res.result
      });
    });
    Api.getCurrent().then(res => {
      this.setState({
        current: {
          difficult: (res.difficult / 1000000000000).toFixed(2),
          rate: (res.rate / 1000000000).toFixed(2),
          price: res.price.toFixed(2)
        }
      });
    });
    this.timmer = setTimeout(() => {
      this.loadData();
    }, 30 * 1000);
  }
  loadLineChart() {
    Api.getLatesChart().then(res => {
      this.setState({
        chartData: res.data
      });
    });
  }
  getColumns() {
    return [{
      title: '区块号',
      dataIndex: 'number',
      key: 'number',
      render: (data) => <Link to={`/block/${data}`}>{data}</Link>
    }, {
      title: '交易笔数',
      dataIndex: 'transaction_count',
      key: 'transaction_count'
    }, {
      title: '难度',
      dataIndex: 'bits',
      key: 'bits',
    }, {
      title: '出块时间',
      dataIndex: 'time_stamp',
      key: 'time_stamp',
      render: (data) => formatTime(data),
    }];
  }
  render() {
    const state = this.state;
    const { current } = state;
    const width = document.body.offsetHeight;
    return (<div>
      {current ? <div className="currentOverview">
        <div className="item">
          <h5>当前难度</h5>
          <p>{current.difficult || '~'} T</p>
        </div>
        <div className="item">
          <h5>当前算力</h5>
          <p>{current.rate || '~'} GH</p>
        </div>
        <div className="item">
          <h5>ETP价格</h5>
          <p>
            <span>¥ {current.price || '~'}</span>
            <span className="cap">(总市值：¥{current.cap})</span>
          </p>
        </div>
      </div> : null}
      <div className="latest-top">
        <h3>最新区块</h3>
        {
          state.loading ?
            <div style={{ textAlign: 'center' }}><Spin /></div>
          :
            <Table dataSource={state.list} columns={this.getColumns()} pagination={false} />
        }
      </div>
      <div className="last100">
        <h3>最近100天交易次数</h3>
        {state.chartData ? <Line
          data={state.chartData}
          forceFit
          height={300}
          plotCfg={state.plotCfg}
        /> : null}
      </div>
    </div>);
  }
}