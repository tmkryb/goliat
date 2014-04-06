var fs = require("fs");
var util = require("util");
var path = require("path");
function route(pathname, response, request, query){
	console.log("About to route a request for " + pathname);

	var extensions = {  

		".html" : "text/html",
		".css" : "text/css",
		".js" : "application/javascript",
		".png" : "image/png",
		".gif" : "image/gif",
		".jpg" : "image/jpeg"
	};

	var
	fileName = path.basename(request.url) || 'index.html',
	ext = path.extname(fileName),
	localFolder = __dirname,
	page404 = localFolder + '/404.htm';
	console.log(ext);
	if (ext != ".html")
	{
		var filePath = localFolder + request.url;
		path.exists(filePath,function(exists){
        //if it does...
        console.log(exists);
        console.log(filePath);
        if(exists){
            //read the fiule, run the anonymous function
            fs.readFile(filePath,function(err,contents){
            	if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    response.writeHead(200,{
                    	"Content-type" : extensions[ext],
                    	"Content-Length" : contents.length
                    });
                    response.end(contents);
                    console.log("returned a file");
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });

        }
    })
	return;
}


var controllerName = pathname.replace("/","");

var route = pathname.match(/[^/]+/g);

console.log(request.headers);

if (route){
	if (route.length === 1){
		pathname = 'index';
		controllerName = route[0];
	}

	if (route.length === 2){
		pathname = route[1];
		controllerName = route[0];
	}

}
if (pathname === "/"){
	pathname = "index";
	controllerName = "home";
}




	//przekieruj te dane do kontrolera
	try{
		
		var controller = require("./controllers/" + controllerName);

		var thisController = new controller(response, pathname, query);
		if (thisController[pathname]){
			thisController[pathname].call(thisController);
		}else{
			response.end("Error! Action '" + pathname + "'' not found");
		}
	}catch(e){

		response.end("Error! Controller '"+ controllerName +"'' not found!");
	}
}

exports.route = route;