var http = require("http");
var url = require("url");
var util = require("util");

function start(route){
	
	function onRequest(request, response){
		
			var pathName = url.parse(request.url).pathname;
			var query = url.parse(request.url, true).query;
			
			
			console.log("Request for page: " + pathName);
			
			var html = route(pathName, response, query);			
			
		
	}

	http.createServer(onRequest).listen(8888);

	console.log("Server started");
}

exports.start = start;