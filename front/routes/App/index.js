import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Breadcrumb, Menu, Icon } from 'antd';
import classnames from 'classnames';
import Header from '~/header';
import Index from '../Index';
import Lang from '@/lang';

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
            <h3>{Lang.App.officialSite}</h3>
            <div>
              <a href="http://mvs.live/" target="_blank">Metaverse</a>
              <a href="http://explorer.mvs.live/" target="_blank">{Lang.App.explorer}</a>
              <a href="http://bbs.viewfin.com/" target="_blank">{Lang.App.bbs}</a>
            </div>
          </div>
          <div className="link-group">
            <h3>{Lang.App.wallet}</h3>
            <div>
              <a href="http://y-z-c-m.com:8088/ico/html/downApp2.html" target="_blank">cloud钱包</a>
              <a href="https://tokenmaster.info/" target="_blank">TokenMaster</a>
            </div>
          </div>
          <div className="link-group">
            <h3>{Lang.App.pool}</h3>
            <div>
              <a href="http://etp.uupool.cn/pool/etp" target="_blank">uupool</a>
            </div>
          </div>
          <div className="link-group">
            <h3>{Lang.App.exchange}</h3>
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