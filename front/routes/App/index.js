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
          <a href="http://mvs.live/" target="_blank">Metaverse</a>
          <a href="http://explorer.mvs.live/" target="_blank">官方区块浏览器</a>
          <a href="http://etp.uupool.cn/pool/etp" target="_blank">双优矿池</a>
          <a href="https://tokenmaster.info/" target="_blank">TokenMaster</a>
          <a href="https://www.bitfinex.com/" target="_blank">Bitfinex</a>
          <a href="https://www.rightbtc.com/" target="_blank">rightbtc</a>
        </div>
      </div>
    );
  }
}