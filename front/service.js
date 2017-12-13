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

export const getAddressOverview = (num, page) => (
  axios.get(`/api/address/${num}`)
);

export const getAddressTx = (num, page) => (
  axios.get(`/api/address-tx/${num}?page=${page}`)
);

export const getAssets = (num, page) => (
  axios.get(`/api/assets`)
);


export const getLatesChart = (day = 100) => (
  axios.get(`/api/dayreport?day=${day}`)
);

export const getFreeHistory = () => (
  axios.get(`/api/free-history`)
);

export const freeSend = (data) => (
  axios.post(`/api/free-send`, data)
);

export const getRichOverview = () => (
  axios.get(`/api/topoverview`)
);

export const getRichList = (page = 1, sort, order) => (
  axios.get(`/api/toplist?page=${page}&sort=${sort}&order=${order}`, )
);