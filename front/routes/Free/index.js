import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Alert, Input, Select, Button, message } from 'antd';
import * as Api from '@/service';
import { moment, formatAssetValue } from '@/utils';
import Lang from '@/lang';

import './style.less';

message.config({
  duration: 5
});
const InputGroup = Input.Group;
const Option = Select.Option;

export default class Free extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '1',
      address: ''
    };
    this.loadHistory();

    this.send = this.send.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setValue = this.setValue.bind(this);
    this.loadHistory = this.loadHistory.bind(this);
  }
  loadHistory() {
    Api.getFreeHistory().then(res => {
      this.setState({
        freeHistory: res.data
      });
      setTimeout(this.loadHistory, 9 * 1000);
    });
  }
  send() {
    const { address, value } = this.state;
    if (!address) {
      message.error(ListeningStateChangedEvent.Free.noAddressTips);
      return;
    }
    Api.freeSend({
      address,
      value
    }).then(res => {
      if (res.msg) {
        message.error(res.msg);
      } else {
        message.success(Lang.Free.sendSuccessTips);
        this.setState({
          address: ''
        });
      }
    });
  }
  handleChange(e) {
    this.setState({
      address: e.target.value
    });
  }
  setValue(v) {
    this.setState({
      value: v
    });
  }
  render() {
    const { freeHistory, value, address } = this.state;
    return (
      <div className="free-page">
        <h3>{Lang.Free.title}</h3>
        <Alert
          message={<div>
            <p>{Lang.Free.notice1}</p>
            <p>{Lang.Free.notice2}</p>
          </div>}
          type="warning"
          showIcon
        />
        <div className="from">
          <InputGroup compact size="large">
            <Select defaultValue="1" onChange={this.setValue} value={value}>
              <Option value="1">0.0002</Option>
              <Option value="2">0.0003</Option>
            </Select>
            <Input style={{ width: '50%' }} onChange={this.handleChange} placeholder="ETP接收地址" value={address} />
            <Button type="primary" size="large" className="btn" onClick={this.send}>{Lang.Free.apply}</Button>
          </InputGroup>
        </div>
        
        {freeHistory ? <div>
          <div className="free-balance">{Lang.Free.balance}: {formatAssetValue(freeHistory.balance, 'etp')}ETP</div>
          <div className="free-history">
            {freeHistory.history.map(item => <p>
                <span className="time">{moment(new Date(item.time)).format('YYYY-MM-DD HH:mm:ss')}</span>
                <span className="address">{item.address}</span>
                <span className="info">{Lang.Free.received}{formatAssetValue(item.value, 'etp')}</span>
              </p>)}
          </div>
        </div> : null}
      </div>
    );
  }
}