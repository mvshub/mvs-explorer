import axios from 'axios';
import { message } from 'antd';

let lang = 'en';
if (navigator.language == 'zh-CN') {
  lang = 'zh';
}
const local = localStorage.getItem('lang');
if (local && local == 'zh') {
  lang = zh;
} else if (local == 'zh') {
  lang = en;
}

axios.defaults.headers['lang'] = lang;

axios.interceptors.response.use((res) => {
  return res.data;
}, (err) => {
  console.error(err);
  return { errcode: 'response error' };
});

export default axios;
