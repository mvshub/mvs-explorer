import axios from './axios.js';
import moment from './moment.js';
import ba from 'binascii';

const initParams = (params) => {
  let args = {};
  for(let key in params) {
    if (typeof params[key] === 'undefined' || params[key] === '') continue;
    if (params.hasOwnProperty(key)) args[key] = params[key];
  }
  return args;
};

const isEmptyObject = obj => {
  for ( let key in obj ) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

const thousandBitSeparator = num => {
  return num.toString().indexOf('.') !== -1
       ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => `${$1},`)
       : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, ($0, $1) => `${$1},`);
};

const formatTime = (num) => {
  let time = `${num}000`;
  time = new Date(parseInt(time, 10));
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

const assetValueMap = {
  'etp': (val) => (val/100000000).toFixed(8),
  'mvs.zgc': (val) => (val/100000000).toFixed(8),
  'cmc': (val) => (val/10000).toFixed(4)
}
const formatAssetValue = (num, type) => {
  if (type) {
    type = type.toLocaleLowerCase();
  }
  if (assetValueMap[type]) {
    return assetValueMap[type](num);
  }
  return num;
}

const parseLockHeight = (script) => {
  const m = script.match(/\[ (\w+) \] numequalverify/)
  if (!m) {
    return 0;
  }
  const num = m[1];
  const l = ba.unhexlify(num).split('');
  let res = 0;
  l.forEach((val, i) => {
    res = res | (val.charCodeAt() << (8*i) );
  });
  if (l[l.length - 1].charCodeAt() & 0x80) {
    res = - (res & ~ (0x80 << (8 * (l.length - 1))) )
  }
  return res;
}
export {
  axios,
  moment,
  initParams,
  isEmptyObject,
  thousandBitSeparator,
  formatTime,
  formatAssetValue,
  parseLockHeight
};
