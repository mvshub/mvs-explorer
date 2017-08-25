import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Row, Col, Icon  } from 'antd';
import TxList from '~/tx-list';
import * as Api from '@/service';
import { moment, formatTime, formatAssetValue } from '@/utils';

import './style.less';

const KeyMap = [{
  key: 'hash',
  name: '哈希'
}, {
  key: 'time_stamp',
  name: '出块时间',
  render: (val) => formatTime(val)
}, {
  key: 'transaction_count',
  name: '交易笔数'
}, {
  key: 'nonce',
  name: '随机数'
}, {
  key: 'mixhash',
  name: 'Mix Hash'
}, {
  key: 'version',
  name: '版本'
}, {
  key: 'bits',
  name: '难度'
}, {
  key: 'merkle_tree_hash',
  name: '默克尔树哈希'
}, {
  key: 'previous_block_hash',
  name: '前一区块哈希'
}]

export default class Block extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      loading: true,
      blockId: props.params.id
    };
    this.loadData(this.state.blockId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.state.blockId) {
      this.setState({ 
        list: null,
        blockId: nextProps.params.id,
        loading: true
      });
      this.loadData(nextProps.params.id);
    }
  }
  loadData(id) {
    Api.getBlockDetail(id).then(res => {
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
      <div className="block-detail">
        <h3>区块: {state.blockId}</h3>
        {
          state.loading ?
            <div style={{ textAlign: 'center' }}><Spin /></div>
          :
            <div>
              {state.data ? <div>
                {KeyMap.map(item => {
                  let val;
                  if (item.render) {
                    val = item.render(state.data.details[item.key]);
                  } else {
                    val = state.data.details[item.key];
                  }
                  return <Row>
                    <Col span={4}>{item.name}</Col>
                    <Col span={20}>{val}</Col>
                  </Row>;
                })}
                <h4 style={{marginTop: '10px'}}>交易</h4>
                <TxList data={state.data.txs} />
              </div> : state.msg}
            </div>
        }
      </div>
    );
  }
}