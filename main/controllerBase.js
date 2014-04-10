module.exports = (function () {
	var util = require("util");
	var extend = require("extend");
	var fs = require("fs");
	function controllerBase(controllerParams){
		
		this.response = controllerParams.response;
		this.path = controllerParams.path;
		this.query = controllerParams.query;
		this.request = controllerParams.request;

	}

	extend(controllerBase.prototype,{		
		renderHtmlView:	function(file, model){ 
			if (model){
				util.log("There is a model passed");
				
			}

			var response = this.response;
			response.writeHead(200, {"Content-Type": "text/html", "Server": "Goliat 0.1"});
			
			fs.readFile("./views/"+ this.folder + "/" + file + '.html', function(error, html){
				//console.log(JSON.stringify(this));
				if(html){					
					response.write(html);
					response.end();				
				}else
				{			
					response.end("There was an error\n");
				}
			});
		},
		returnJson: function(toReturn){			
			this.response.writeHead(200, {"Content-Type": "application/json", "Server": "Goliat 0.1"});			
			this.response.end(JSON.stringify(toReturn));
		},
		renderJadeView: function(file, model){
			var jade = require('jade');			
			var response = this.response;
			response.writeHead(200, {"Content-Type": "text/html", "Server": "Goliat 0.1"});			
			jade.renderFile("./views/"+ this.folder + "/" + file + '.jade', model, function (err, html) {
				 
				 if (err) console.log(err);
				 console.log("rendering Jade");
				 if(html){					
					response.write(html);
					response.end();				
				}else
				{			
					response.end("There was an error\n");
				} 				
			});
		}
	});
	return controllerBase;
})();