import React, { Component } from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import { Input, message, Menu, Dropdown, Icon } from 'antd';
import Lang from '#/lang';

import './style.less';

const Search = Input.Search;
const menu = (
  <Menu onSelect={item =>{ localStorage.setItem('lang', item.key); location.reload(); }}>
    <Menu.Item key="zh">中文</Menu.Item>
    <Menu.Item key="en">English</Menu.Item>
  </Menu>
);


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
          <div>{Lang.Header.name}</div>
        </div>
        <div className="navs">
          <div className="menus">
            <Link to="/">{Lang.Header.home}</Link>
            <Link to="/charts">{Lang.Header.charts}</Link>
            <Link to="/fortune">{Lang.Header.rich}</Link>
            <Link to="/assets">{Lang.Header.assets}</Link>
            <Link to="/free">{Lang.Header.free}</Link>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                {Lang.Header.language}<Icon type="down" />
              </a>
            </Dropdown>
          </div>
          <div className="search">
            <Search placeholder={Lang.Header.search} onSearch={this.search} />
          </div>
        </div>
        
      </header>
    );
  }
}

