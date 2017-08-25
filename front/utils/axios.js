import axios from 'axios';
import { message } from 'antd';

// axios.defaults.baseURL = '';
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// axios.interceptors.request.use(config => ({
//   ...config,
//   // withCredentials: true
// }));

axios.interceptors.response.use((res) => {
//   if (typeof res.data != 'object') {
//     console.error(res.data);
//     return { errcode: 'response error' };
//   }
  return res.data;
}, (err) => {
  console.error(err);
  return { errcode: 'response error' };
});

export default axios;
