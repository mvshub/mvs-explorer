import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Alert, Input, Select, Button, message, Table, Pagination } from 'antd';
import * as Api from '#/service';
import { moment, formatAssetValue } from '#/utils';
import Lang from '#/lang';
import { Chart, Axis, Geom, Tooltip, Coord, Legend, Label } from 'bizcharts';
import { View, DataView } from '@antv/data-set';

import './style.less';

export default class RichList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      overview: {},
      list: [],
      page: 1,
      sort: 'unspent',
      order: 'desc'
    };
    this.loadData(1);
    this.pageChange = this.pageChange.bind(this);
    this.tableChange = this.tableChange.bind(this);
  }
  componentWillUnmount() {
    
  }
  loadData() {
    const { page, sort, order } = this.state;
    Api.getRichOverview().then(res => {
      this.setState({
        loading: false,
        overview: res.data
      });
    });
    Api.getRichList(page, sort, order).then(res => {
      this.setState({
        list: res.data.list,
        page
      });
    });
  }
  pageChange(page) {
    this.setState({
      page
    }, () => this.loadData());
  }
  tableChange(page, filter, sorter) {
    this.setState({
      page: 1,
      sort: sorter.field,
      order: sorter.order.replace('end', '')
    }, () => this.loadData());
  }
  getColums() {
    const { page, overview, sort, order } = this.state;
    return [{
      title: Lang.RichList.rank,
      dataIndex: 'index',
      key: 'index',
      render: (v, data, index) => {
        if (order == 'desc') {
          return (page -1) * 100 + index + 1;
        }
        return overview.addressCount - ((page -1) * 100 + index);
      }
    }, {
      title: Lang.RichList.address,
      dataIndex: 'address',
      key: 'address',
    }, {
      title: Lang.RichList.balance,
      dataIndex: 'unspent',
      key: 'unspent',
      sortOrder: sort == 'unspent' ?  order + 'end' : false,
      sorter: true,
      render: val => formatAssetValue(val, 'etp'),
    }, {
      title: Lang.RichList.frozen,
      dataIndex: 'frozen',
      key: 'frozen',
      sortOrder: sort == 'frozen' ?  order + 'end' : false,
      sorter: true,
      render: val => formatAssetValue(val, 'etp')
    }, {
      title: Lang.RichList.percent,
      dataIndex: 'percent',
      key: 'percent',
      render:(value, data, index) => (data.unspent * 100 / overview.supply).toFixed(4) + '%'
    }];
  }
  renderPei(overview) {
    const low100 = overview.addressCount - overview.balance_over_1w - overview.balance_1k_1w - overview.balance_100_1k;
    const data = [
      { item: Lang.RichList.over1w, count: overview.balance_over_1w },
      { item: Lang.RichList.over1k, count: overview.balance_1k_1w },
      { item: Lang.RichList.over100, count: overview.balance_100_1k },
      { item: Lang.RichList.less100, count: low100 }
    ];
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        }
      }
    }  
    return <Chart height={300} data={dv} scale={cols} padding={[ 0, 100, 0, 100 ]} forceFit>
      <Coord type='theta' radius={0.75} />
      <Axis name="percent" />
      <Tooltip 
        showTitle={false} 
        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
      <Geom
        type="intervalStack"
        position="percent"
        color='item'
        tooltip={['item*percent*count',(item, percent, val) => ({
          name: item,
          value: val
        })]}
        style={{lineWidth: 1,stroke: '#fff'}}
        >
        <Label content='percent' formatter={(val, item) => {
            return item.point.item + ': ' + val;}} />
      </Geom>
    </Chart>;
  }
  render() {
    const { loading, overview, list, page } = this.state;
    if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin /></div>;
    }
    return (
      <div className="rich-page">
        <h3>{Lang.RichList.title}</h3>
        <div className="overview clearfix">
          <div className="info">
            <div className="info-box">
              <div className="name">{Lang.RichList.endBLock}</div>
              <div className="value">{overview.endBlock}</div>
            </div>
            <div className="info-box">
              <div className="name">{Lang.RichList.over0}</div>
              <div className="value">{overview.addressCount}
              </div>
            </div>
            <div className="info-box">
              <div className="name">{Lang.RichList.supply}</div>
              <div className="value">{parseInt(formatAssetValue(overview.supply, 'etp'), 10)}</div>
            </div>
            <div className="info-box">
              <div className="name">{Lang.RichList.frozen}</div>
              <div className="value">{parseInt(formatAssetValue(overview.frozen, 'etp'))}</div>
            </div>
          </div>
          <div className="overview-pie">
            {this.renderPei(overview)}
          </div>
        </div>
        <div className="rich-list">
          <Table dataSource={list} columns={this.getColums()} pagination={false} onChange={this.tableChange}/>
          <div className="pager">
            <Pagination total={overview.addressCount} current={page} pageSize={100} onChange={this.pageChange}/>
          </div>
        </div>
      </div>
    );
  }
}