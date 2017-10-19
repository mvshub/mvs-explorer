import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table } from 'antd';
import * as Api from '@/service';
import { moment, formatTime } from '@/utils';
import Lang from '@/lang';

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
      title: Lang.Assets.symbol,
      dataIndex: 'symbol',
      key: 'symbol'
    }, {
      title: Lang.Assets.name,
      dataIndex: 'name',
      key: 'name'
    }, {
      title: Lang.Assets.supply,
      dataIndex: 'maximum_supply',
      key: 'maximum_supply',
      render: (val, record) => {
        if (record.decimal_number && record.decimal_number > 0) {
          return Number(val) / Math.pow(10, record.decimal_number);
        }
        return val;
      }
    }, {
      title: Lang.Assets.site,
      dataIndex: 'site',
      key: 'site',
      render: (val) => <a href={val} target="_blank">{val}</a>
    }, {
      title: Lang.Assets.description,
      dataIndex: 'description',
      key: 'description'
    }];
  }
  render() {
    const state = this.state;
    return (
      <div className="assets-page">
        <h3>{Lang.Assets.assets}</h3>
        <Table dataSource={state.list} columns={this.getColumns()} pagination={false} />
      </div>
    );
  }
}