import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table } from 'antd';
import * as Api from '@/service';
import { moment, formatTime } from '@/utils';

import './style.less';

export default class Assets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
          {symbol: 'ETP', name: '熵', total: '1亿', site: 'http://mvs.live'},
          {symbol: 'MVS.ZGC', name: '黄金链', total: '1亿', site: 'http://zengold.org'},
          {symbol: 'CMC', name: '云链代币', total: '未知', site: 'http://www.cloudchain.vip/'},
          {symbol: 'TEA', name: '茶链', total: '未知', site: ''},
      ],
    };
  }
  getColumns() {
    return [{
      title: '资产符号',
      dataIndex: 'symbol',
      key: 'symbol'
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '发行量',
      dataIndex: 'total',
      key: 'total'
    }, {
      title: '官网',
      dataIndex: 'site',
      key: 'site',
      render: (val) => <a href={val} target="_blank">{val}</a>
    }];
  }
  render() {
    const state = this.state;
    return (
      <div className="assets-page">
        <h3>元界资产名词</h3>
        <Table dataSource={state.list} columns={this.getColumns()} pagination={false} />
      </div>
    );
  }
}