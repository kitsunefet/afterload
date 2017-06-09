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
//console.log('');
//console.log('query: '+queryData.url);

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
                        var html=afterLoad(require('querystring').escape(queryData.url));
                        response.write(html);
//              console.log(html);
        }
        response.end();
}

});

server.listen(port);
console.log("Server is listening at :"+port + " using token: "+token);
