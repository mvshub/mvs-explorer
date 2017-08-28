import { axios } from './utils';

export const getCurrent = () => (
  axios.get('/api/current')
);

export const getLatestBlocks = (num) => (
  axios.get('/api/latest')
);

export const getBlockDetail = (num) => (
  axios.get(`/api/block/${num}`)
);

export const getTxDetail = (num) => (
  axios.get(`/api/tx/${num}`)
);

export const getAddressDetail = (num, page) => (
  axios.get(`/api/address/${num}?page=${page}`)
);

export const getAssets = (num, page) => (
  axios.get(`/api/assets`)
);


export const getLatesChart = (day = 100) => (
  axios.get(`/api/dayreport?day=${day}`)
);