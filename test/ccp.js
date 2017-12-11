
var ccap = require('ccap')({
  
});//Instantiated ccap class 

var ary = ccap.get();

	var txt = ary[0];

	var buf = ary[1];

	// response.end(buf);

  console.log(txt);
  console.log(buf);

  const fs = require('fs');
  fs.writeFileSync('./a.png', buf);