import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Row, Col, Icon, Popover, Pagination  } from 'antd';
import * as Api from '@/service';
import { moment, formatTime, formatAssetValue } from '@/utils';
import TxLoader from './txloader';
import TxList from '~/tx-list';
import Lang from '@/lang';

import './style.less';

export default class Address extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      loading: true,
      details: null,
      totalPage: 1,
      addressId: props.params.id,
      page: 1,
      data: [],
      assests: [],
      txCount: 0
    };
    this.loadData(this.state.addressId, 1);
    this.loadOverview(this.state.addressId);
    this.pageChange = this.pageChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.state.addressId) {
      this.setState({
        page: 1,
        loading: true,
        list: null,
        details: null,
        addressId: nextProps.params.id
      });
      this.loadOverview(nextProps.params.id);
      this.loadData(nextProps.params.id, 1);
    }
  }
  loadOverview(id) {
    Api.getAddressOverview(id).then(res => {
      this.setState({
        details: res.result.details,
        assests: res.result.assests || [],
        txCount: res.result.txCount
      });
    });
  }
  loadData(id, page) {
    this.setState({
      loading: true
    });
    Api.getAddressTx(id, page).then(res => {
      if (res.result) {
        this.setState({
          loading: false,
          data: res.result.txs,
          page,
          totalPage: res.result.totalPage
        });
      } else if (res.msg) {
        this.setState({
          msg: res.msg,
          list: null,
          details: null,
          loading: false
        });
      }
    });
  }
  pageChange(page) {
    this.loadData(this.state.addressId , page);
  }
  renderPageList() {
    const { data, page, details } = this.state;
    if (!details.transactions) {
      return <p>{Lang.Address.noData}</p>;
    }
    return data.map(item => <TxLoader txId={item.hash} key={item.hash} />);
  }
  render() {
    const state = this.state;
    console.log(state);
    return (
      <div className="address-detail">
        <Row>
          <Col span={12}>
            <div className="overview">
              <Row>
                <Col span={4}>{Lang.Address.address}</Col>
                <Col span={20}>{state.addressId} </Col>
              </Row>
              <Row>
                <Col span={4}>{Lang.Address.balance}</Col>
                <Col span={20} className="balance">
                  <div>{state.details ? formatAssetValue(state.details.unspent, 'ETP') : 0}</div>
                  <div className="extra">
                    <p>{Lang.Address.available}: {state.details ? formatAssetValue(state.details.unspent - state.details.frozen, 'ETP') : 0}</p>
                    <p>{Lang.Address.frozen}: {state.details ? formatAssetValue(state.details.frozen, 'ETP') : 0}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>{Lang.Address.received}</Col>
                <Col span={20}>{state.details ? formatAssetValue(state.details.received, 'ETP') : 0}ETP </Col>
              </Row>
              <Row>
                <Col span={4}>{Lang.Address.txCount}</Col>
                <Col span={20}>{state.txCount} </Col>
              </Row>
              <Row>
                <Col span={4}>{Lang.Address.assets}</Col>
                <Col span={20}>
                  <div className="assests">
                    {state.assests.map(item => <p>
                      <em>{item.symbol}</em>
                      <span>{formatAssetValue(item.quantity, item.symbol)}</span> 
                    </p>)}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className="qrcode">
              <img src={`http://editor.wxb.com/api/qrcode?text=${state.addressId}&size=10&margin=1`} />
            </div>
          </Col>
        </Row>
        
        <h4 style={{marginTop: '10px'}}>{Lang.Address.history}</h4>
        {state.loading ? <div style={{ textAlign: 'center' }}><Spin /></div> : null}
        {!state.loading && state.data ? <div>
          <TxList data={state.data} noIndex address={state.addressId} />
          <div className="tx-pager">
            <Pagination defaultCurrent={1} total={state.totalPage * 100} current={state.page} pageSize={100} onChange={this.pageChange} />
          </div>
        </div> : null}
        {!state.loading && state.msg ?  state.msg : null}
      </div>
    );
  }
}