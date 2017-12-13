import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Table, Row, Col, Icon  } from 'antd';
import TxList from '~/tx-list';
import * as Api from '#/service';
import { moment, formatTime, formatAssetValue } from '#/utils';
import Lang from '#/lang';

import './style.less';

const KeyMap = [{
  key: 'hash',
  name: Lang.Block.hash
}, {
  key: 'time_stamp',
  name: Lang.Block.blockTime,
  render: (val) => formatTime(val)
}, {
  key: 'transaction_count',
  name: Lang.Block.txCount
}, {
  key: 'nonce',
  name: Lang.Block.nonce
}, {
  key: 'mixhash',
  name: 'Mix Hash'
}, {
  key: 'version',
  name: Lang.Block.version
}, {
  key: 'bits',
  name: Lang.Block.bits
}, {
  key: 'merkle_tree_hash',
  name: Lang.Block.merkleHash
}, {
  key: 'previous_block_hash',
  name: Lang.Block.previousHash
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
        <h3>{Lang.Block.block}: {state.blockId}</h3>
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
                <h4 style={{marginTop: '10px'}}>{Lang.Block.tx}</h4>
                <TxList data={state.data.txs} />
              </div> : state.msg}
            </div>
        }
      </div>
    );
  }
}