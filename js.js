var afterLoad=require('after-load');
const args = process.argv;

var fs = require('fs');
function readWriteSync(newValue) {
  var data = fs.readFileSync('/var/www/html/result.txt', 'utf-8');
  fs.writeFileSync('/var/www/html/result.txt', newValue, 'utf-8');
}

readWriteSync("");

var html=afterLoad(args[2]);

readWriteSync(html);
