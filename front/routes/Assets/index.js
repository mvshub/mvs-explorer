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
      list: [],
    };
    Api.getAssets().then(res => {
      this.setState({
        list: res.assets
      });
    });
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
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
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