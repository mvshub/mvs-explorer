import React, { Component } from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import { Input, message } from 'antd';
const Search = Input.Search;

import './style.less';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }
  search(val) {
    if (val == undefined || val  == '') {
      return;
    }
    val = val.trim();
    const len = val.length; 
    const { history } = this.props;
    if (len == 34) {
      // address
      history.push(`/address/${val}`);
    } else if(len == 64) {
      // hash
      history.push(`/tx/${val}`);
    } else if (Number(val) != NaN) {
      // block
      history.push(`/block/${val}`);
    } else {
      message.error('无法识别你输入的内容!');
    }
  }
  render() {
    const { className, ...otherProps } = this.props;
    const cls = cx(
      'component-header-wrap',
      'clearfix',
      className
    );
    return (
      <header className={cls} {...otherProps}>
        <div className="logo text-right">
          <span>
            <Link to="/">
              <img src="http://s.weituibao.com//static/1499390458758/logo-black.png" alt=""/>
            </Link>
          </span>
          <div>元界区块浏览</div>
        </div>
        <div className="search">
          <Search placeholder="地址/哈希/区块" onSearch={this.search} />
        </div>
        <div className="menus">
          <Link to="/charts">图表</Link>
          <Link to="/assets">资产列表</Link>
          <Link to="/free">免费领币</Link>
        </div>
      </header>
    );
  }
}

