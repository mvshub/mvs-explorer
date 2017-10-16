import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Breadcrumb, Menu, Icon } from 'antd';
import classnames from 'classnames';
import Header from '~/header';
import Index from '../Index';

import './style.less';

export default class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { children, history } = this.props;

    return (
      <div className="">
        <Header className="header" history={history} />
        <div className="container">{children ? children : <Index />}</div>
        <footer className="copy-right text-center">
          
        </footer>
        <div className="footer-links">
          <div className="link-group">
            <h3>官方网站</h3>
            <div>
              <a href="http://mvs.live/" target="_blank">Metaverse</a>
              <a href="http://explorer.mvs.live/" target="_blank">区块浏览</a>
              <a href="http://bbs.viewfin.com/" target="_blank">元界社区</a>
            </div>
          </div>
          <div className="link-group">
            <h3>钱包</h3>
            <div>
              <a href="http://y-z-c-m.com:8088/ico/html/downApp2.html" target="_blank">cloud钱包</a>
              <a href="https://tokenmaster.info/" target="_blank">TokenMaster</a>
            </div>
          </div>
          <div className="link-group">
            <h3>矿池</h3>
            <div>
              <a href="http://etp.uupool.cn/pool/etp" target="_blank">uupool</a>
            </div>
          </div>
          <div className="link-group">
            <h3>交易</h3>
            <div>
              <a href="https://www.bitfinex.com/" target="_blank">Bitfinex</a>
              <a href="https://www.rightbtc.com/" target="_blank">rightbtc</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}