import React, { Component } from 'react';
import { Spin } from 'antd';
import TxList from '~/tx-list';
import * as Api from '@/service';
import { formatTime } from '@/utils';

export default class TxLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      list: null
    };
    this.loadData(props.txId, props.blockId);
  }
  loadData(id, blockId) {
    Api.getTxDetail(id).then(res => {
      this.setState({
        loading: false,
        data: res.result,
        status: res.status
      });
    });
    Api.getBlockDetail(blockId).then(res => {
      this.setState({
        block: res.result
      });
    });
  }
  render() {
    const state = this.state;
    let blockTime = null;
    if (state.block && state.block.details) {
      blockTime = formatTime(state.block.details.time_stamp);
    }
    return (<div className="address-tx-row">
        {state.loading ?
            <div style={{ textAlign: 'center' }}><Spin /></div>
            :
            <TxList data={[state.data]} noIndex blockTime={blockTime}/>
        }
    </div>);
  }
}