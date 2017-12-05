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
        <footer className="text-center">
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
                <a href="https://metaverse.farm" target="_blank">metaverse.farm</a>
                <a href="http://etp.huopool.com/" target="_blank">huopool</a>
                <a href="http://pool.mvs.live" target="_blank">pool.mvs.live</a>
                <a href="http://xinyuanjie.org" target="_blank">xinyuanjie.org</a>
                <a href="http://etp.dodopool.com" target="_blank">dodopool</a>
                <a href="http://cryptopoolpond.com/#/" target="_blank">cryptopoolpond.com</a>
                <a href="http://etp.altpool.pro" target="_blank">altpool</a>
                <a href="https://etp.fairpool.xyz" target="_blank">fairpool</a>
                <a href="http://etp.mole-pool.net:85" target="_blank">etp.mole-pool</a>
                <a href="http://etp.sandpool.org/" target="_blank">sandpool</a>
                <a href="https://2miners.com/" target="_blank">2miners.com</a>
              </div>
            </div>
            <div className="link-group">
              <h3>{Lang.App.exchange}</h3>
              <div>
                <a href="https://www.bitfinex.com/" target="_blank">Bitfinex</a>
                <a href="https://www.rightbtc.com/" target="_blank">rightbtc</a>
                <a href="https://hitbtc.com/" target="_blank">hitbtc</a>
              </div>
            </div>
          </div>
        </footer>  
      </div>
    );
  }
}