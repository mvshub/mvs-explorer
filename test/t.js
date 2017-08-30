var ba = require('binascii');


function parseLockHeight(num) {
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

const s = '[ d00c14 ] numequalverify dup hash160 [ 17c33fd450d417870f596f78a98bada7f245153c ] equalverify checksig'

console.log(parseLockHeight(s.match(/\[ (\w+) \]/)[1]));

// console.log(parseLockHeight('d00c14'));

