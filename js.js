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

//console.log('query'+queryData.url);

	response.writeHead(200, {"Content-Type": "text/html"});
	if (queryData.token===token && queryData.url) {
		var afterLoad=require('afterload');
		var html=afterLoad(queryData.url);

		response.write(html);

//		console.log(html);
	}


response.end();

});

server.listen(port);
console.log("Server is listening at :"+port + " using token: "+token);
