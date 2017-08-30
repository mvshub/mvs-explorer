import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Row, Col, Icon, Tag } from 'antd';
import { formatAssetValue, formatTime, parseLockHeight } from '@/utils';

import './style.less';

const TxType = [
  <Tag color="#fadb0a">挖矿奖励</Tag>,
  <Tag color="#00a854">收入</Tag>,
  <Tag color="#fa4141">支出</Tag>,
  <Tag color="#1aa4fc">存款</Tag>,
  <Tag color="#1aa4fc">存款-存入</Tag>,
  <Tag color="#1aa4fc">存款-支出</Tag>,
  <Tag color="#1aa4fc">存款-利息</Tag>
];

function getTxType(tx, address) {
  const inputAddress = {};
  const outputAddress = {};
  let deposit = false;
  tx.inputs.forEach(item => {
    if (item.address) {
      inputAddress[item.address] = true;
    }
  });
  tx.outputs.forEach(item => {
    if (item.address) {
      outputAddress[item.address] = true;
    }
    if (item.script.indexOf('numequalverify') > -1) {
      deposit = true;
    }
  });
  
  //  奖励
  if (Object.keys(inputAddress) == 0 && outputAddress[address]) {
    if (deposit) {
      return 6;
    }
    return 0;
  }
  //收入
  if (!inputAddress[address] && outputAddress[address]) {
    if (deposit) {
      return 4;
    }
    return 1;
  }
  //支出
  if (inputAddress[address]) {
    if (deposit) {
      return 5;
    }
    return 2;
  }
}

export default class TxList extends Component {
  renderInput(data, index) {
    const { showScript } = this.props;
    if (!data.address) {
      return <div key={index} className="input-row">
        <p>奖励</p>
        {showScript ? <p className="script-info">输入脚本:{data.script}</p> : null}
      </div>;
    } else {
      return <div key={index} className="input-row">
        <p>
          <Link to={`/address/${data.address}`}>{data.address}</Link>
          {/*<span style={{paddingLeft: '10px'}}>{formatAssetValue(data.tx_value)}</span>*/}
        </p>
        {showScript ? <p className="script-info">输入脚本:{data.script}</p> : null}
      </div>
    }
  }
  renderOutput(data, index, allData){
    const { showScript } = this.props;
    const isInput = allData.inputs.filter(item => item.address == data.address)[0];
    return <div key={index} className="output-row">
      <p>
        <Link to={`/address/${data.address}`}>{data.address}</Link>
        <span style={{paddingLeft: '10px'}}>{formatAssetValue(data.output_value, data.asset_name)}{data.asset_name}</span>
        {isInput ? <Tag color="green" className="change-back">找零</Tag> : null}
      </p>
      {showScript ? <p className="script-info">输出脚本:{data.script}</p> : null}
    </div>
  }
  renderCount(data) {
    const { inputs, outputs } = data;
    const { address } = this.props;
    const inputAddress = inputs.map(item => item.address);
    const outTx = outputs.filter(item => !inputAddress.includes(item.address));
    const group = {};
    outTx.forEach(item => {
      if (!group[item.asset_name]) {
        group[item.asset_name] = item.output_value;
      } else {
        group[item.asset_name] += item.output_value;
      }
    });
    // 总输入etp
    let inputETP = 0;
    inputs.forEach(item => {
      if (item.address) {
        inputETP += item.tx_value;
      }
    });
    // 总输出etp
    let outETP = 0;
    outputs.forEach(item => {
      if (item.asset_name == 'ETP') {
        outETP += item.output_value;
      }
    });
    let label = '转账';
    let appendDes = '';
    if (address) {
      const txType = getTxType(data, address);
      label = TxType[txType];
      if (txType == 6 || txType == 4) {
        const lockHeight = parseLockHeight(outputs[0].script);
        appendDes = `(解锁高度:${lockHeight})`;
      }
    }
    return <div className="output-count">
      <h5>总计</h5>
      {Object.keys(group).map(key => <p>
        <span className="label">{label}:</span>
        <span>{formatAssetValue(group[key], key)}{key}</span>
        <span>{appendDes}</span>
      </p>)}
    </div>;
  }
  renderTxs(data) {
    const l = [];
    const props = this.props;
    data.forEach((item, index) => {
      // inputs去重地址
      if (!props.showScript) {
        const addressMap = {};
        item.inputs = item.inputs.filter(inItem => {
          if (inItem.address && addressMap[inItem.address]) {
            return false;
          }
          addressMap[inItem.address] = true;
          return true;
        });
      }
      l.push(<div key={item.hash}>
        <Row className="tx-hash">
          {props.noIndex ? null : <span>#{index+1}</span>}
          <Link to={`/tx/${item.hash}`}>{item.hash}</Link>
          <span>区块:</span>
          <Link to={`/block/${item.block_height}`}>{item.block_height}</Link>
          {item.time_stamp ? <span>{formatTime(item.time_stamp)}</span> : null}
        </Row>  
        <Row gutter={8}>
          <Col span={10}>
            {item.inputs.map((inItem, index) => this.renderInput(inItem, index, item))}
          </Col>
          <Col span={4} className="from-to-icon"><Icon type="arrow-right" /></Col>
          <Col span={10}>
            {item.outputs.map((outItem, index) => this.renderOutput(outItem, index, item))}
            {this.renderCount(item)}
          </Col>
        </Row>
      </div>);
    });
    return l;
  }
  render() {
    const props = this.props;
    return (<div className="transaction-list">
        {this.renderTxs(props.data)}
    </div>);
  }
}

// {inputETP > 0 ? <p>
//        <span className="label">手续费:</span><span style={{color: '#999'}}></span>
//      </p> : null}
//      {formatAssetValue(inputETP - outETP)}ETP