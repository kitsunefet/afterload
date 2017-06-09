const args = process.argv;
var http = require('http');
var url = require('url');
var afterLoad=require('afterload');
var token= args[2];
if(!token){
        console.log('no token found, start panic');
        process.exit(-1);
}
var port = args[3];
if(!port){
        console.log('no port found, using default');
        port=33333;
}

var server = http.createServer(function(request, response) {
        var queryData = url.parse(request.url, true).query;

//
console.log('query: '+queryData.url);
        
        var check = new RegExp("^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$","i");
        if(!check.test(queryData.url)){
          queryData="";
//
console.log("query filtered");
        }

        response.writeHead(200, {"Content-Type": "text/html"});
        if (queryData.token===token && queryData.url) {
                var afterLoad=require('afterload');
                var html=afterLoad(require('querystring').escape(queryData.url));

                response.write(html);

//              console.log(html);
        }


response.end();

});

server.listen(port);
console.log("Server is listening at :"+port + " using token: "+token);
