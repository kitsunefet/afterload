function shellescape(a) {
  var ret = [];

  a.forEach(function(s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
      s = "'"+s.replace(/'/g,"'\\''")+"'";
      s = s.replace(/^(?:'')+/g, '') 
        .replace(/\\'''/g, "\\'" );
    }
    ret.push(s);
  });

  return ret.join(' ');
}

const args = process.argv;
var http = require('http');
var url = require('url');
var afterLoad=require('afterload');
var token= args[2];

if(!token){
        console.log('Usage: js.js token [port] [timeout] [useragent] [method]');
        process.exit(-1);
}
var port = args[3];
if(!port){
        port=33333;
}
var default_timeout = args[4];
if(!default_timeout || isNaN(default_timeout)){
        default_timeout=5000;
}
var default_useragent = args[5];
if(!default_useragent){
        default_useragent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
}
else if(isNaN(default_useragent)){
                default_useragent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
}
else{
        var request_ua = require('request');
        var cheerio = require('cheerio');
        request_ua('http://useragentstring.com/index.php?id='+default_useragent, function (error, response_ua, html_ua) {
                if (!error && response_ua.statusCode == 200) {
                    var $ = cheerio.load(html_ua);
                    $('#uas_textfeld').each(function(i, element){
                        default_useragent = $(this).html();
                    });
                } 
                else {
                        default_useragent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
                }
        });
}
var UAtext = default_useragent;

var default_method = args[6];
if(!default_method || default_method.match(/(get|post|put|patch)/i)){
        default_method="GET";
}

var timeout=default_timeout;
var useragent=default_useragent;
var method=default_method;

var server = http.createServer(function(request, response) {
        var queryData = url.parse(request.url, true).query;

        if(typeof queryData.useragent != 'undefined'){
                if(isNaN(queryData.useragent)){
                        UAtext = unescape(queryData.useragent);
                }
                else{
                        var request_ua = require('request');
                        var cheerio = require('cheerio');
                        request_ua('http://useragentstring.com/index.php?id='+queryData.useragent, function (error, response_ua, html_ua) {
                                if (!error && response_ua.statusCode == 200) {
                                        var $ = cheerio.load(html_ua);
                                        $('#uas_textfeld').each(function(i, element){
                                                UAtext = $(this).html();
                                        });
                                } 
                                else {
                                        UAtext = default_useragent;
                                }
                        });
                } 
        }
        else{
                UAtext = default_useragent;
        }

        if(typeof queryData.timeout != 'undefined'){
                if(!(isNaN(queryData.timeout))){
                        timeout = queryData.timeout;
                }
                else{
                        timeout = default_timeout;
                }
        }
        else{
                timeout = default_timeout;
        }

        if(typeof queryData.method != 'undefined'){
                if(queryData.method.toString().toUpperCase() == "POST"){
                        method = "POST";
                }
                else if (queryData.method.toString().toUpperCase() == "PATCH"){
                        method = "PATCH";
                }
                else if (queryData.method.toString().toUpperCase() == "PUT"){
                        method = "PUT";
                }
                else if (queryData.method.toString().toUpperCase() == "GET"){
                        method = "GET";
                }
                else{
                        method = default_method;
                }
        }
        else{
                method = default_method;
        }

        var check = new RegExp('https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)');
//todo - fix regexp
        check = RegExp('.*');
        
        if(!check.test(queryData.url)){
                queryData="";
                console.log("filtered");
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write("wrong query");
                response.end();
        }
        else{
                response.writeHead(200, {"Content-Type": "text/html"});
                if (queryData.token===token && queryData.url) {
                        var afterLoad=require('afterload');
                        var ua_esc = [UAtext];
                        var html=afterLoad(require('querystring').escape(queryData.url),timeout,shellescape(ua_esc),method);
                        response.write(html);
                }
        response.end();
        }

});

server.listen(port);
console.log("server running at port:    "+port);
console.log("using token:               "+token);
console.log("default timeout:           "+timeout);
console.log("default useragent:         "+default_useragent);
console.log("default method:            "+method);
