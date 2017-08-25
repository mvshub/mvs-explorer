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
          <p>捐助ETP: MQwCDbYNSvTpPTSiuxJ4uZU3kB9aq3xNnu</p>
          <p>本站为非元界官方网站，QQ:472811737</p>
        </footer>
      </div>
    );
  }
}