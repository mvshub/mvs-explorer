import zh from './zh';
import en from './en';

let lang = en;
if (navigator.language == 'zh-CN') {
  lang = zh;
}
const local = localStorage.getItem('lang');
if (local && local == 'zh') {
  lang = zh;
} else if (local == 'en') {
  lang = en;
}

export default lang;

