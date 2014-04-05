var fs = require("fs");
var util = require("util");
function route(pathname, response, query){
	console.log("About to route a request for " + pathname);

	var controllerName = pathname.replace("/","");

	var route = pathname.match(/[^/]+/g);

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