var http = require("http");
var url = require("url");
var util = require("util");

function start(route){
	
	function onRequest(request, response){
		
			var pathName = url.parse(request.url).pathname;
			var query = url.parse(request.url, true).query;
			
			
			console.log("Request for page: " + pathName);
			
			route(pathName, response, request, query);			
			
		
	}

	http.createServer(onRequest).listen(8888,function(err) {
    if (err) return cb(err);

    // Find out which user used sudo through the environment variable
    var uid = parseInt(process.env.SUDO_UID);
    // Set our server's uid to that user
    if (uid) process.setuid(uid);
    console.log('Server\'s UID is now ' + process.getuid());
  });

	console.log("Server started");
}

exports.start = start;