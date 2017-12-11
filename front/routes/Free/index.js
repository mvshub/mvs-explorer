import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Alert, Input, Select, Button, message } from 'antd';
import * as Api from '@/service';
import { moment, formatAssetValue } from '@/utils';
import Lang from '@/lang';
import Recaptcha from 'react-google-recaptcha';

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
      address: '',
      captcha: ''
    };
    this.loadHistory();

    this.send = this.send.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setValue = this.setValue.bind(this);
    this.loadHistory = this.loadHistory.bind(this);
    this.setCaptcha = this.setCaptcha.bind(this);
  }
  componentWillUnmount() {
    if (this.timmer != undefined) {
      clearTimeout(this.timmer);
    }
  }
  loadHistory() {
    Api.getFreeHistory().then(res => {
      this.setState({
        freeHistory: res.data
      });
      this.timmer = setTimeout(this.loadHistory, 9 * 1000);
    });
  }
  send() {
    const { address, value, captcha } = this.state;
    if (!address) {
      message.error(Lang.Free.noAddressTips);
      return;
    }
    if (!captcha) {
      message.error(Lang.Free.noCaptcha);
      return;
    }
    Api.freeSend({
      address,
      value,
      captcha
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
  setCaptcha(v){
    this.setState({
      captcha: v
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
            <div className="line">
              <Input  value="0.0002" disabled/>
            </div>
            <div className="line">
              <Input onChange={this.handleChange} placeholder="ETP接收地址" value={address} />
            </div>
            <div className="line">
              <Recaptcha ref="recaptcha" sitekey="6LeyfTwUAAAAAJZg_3Qz0BjDhXgIXhiBcKaNeMxH" onChange={this.setCaptcha} />
            </div>
            <div className="line">
              <Button type="primary" size="large" className="btn" onClick={this.send}>{Lang.Free.apply}</Button>
            </div>
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