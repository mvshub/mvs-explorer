import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Row, Col, Icon  } from 'antd';
import TxList from '~/tx-list';
import * as Api from '#/service';
import Lang from '#/lang';

import './style.less';

export default class Transaction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      loading: true,
      txId: props.params.id
    };
    this.loadData(this.state.txId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.state.txId) {
      this.setState({
        txId: nextProps.params.id,
        list: null,
        loading: true
      });
      this.loadData(nextProps.params.id);
    }
  }
  loadData(id) {
    Api.getTxDetail(id).then(res => {
      this.setState({
        loading: false,
        data: res.result,
        msg: res.msg
      });
    });
  }
  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="tx-detail">
        <h3>{Lang.Transaction.transaction}</h3>
        {
          state.loading ?
            <div style={{ textAlign: 'center' }}><Spin /></div>
          :
            <div>
              {state.data ? <div>
                <TxList data={[state.data]} showScript/>
              </div> : state.msg}
            </div>
        }
      </div>
    );
  }
}