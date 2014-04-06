module.exports = (function () {
	var util = require("util");
	var extend = require("extend");
	var fs = require("fs");
	function controllerBase(){
		
	}

	extend(controllerBase.prototype,{		
		renderView:	function(file, model){ 
			if (model){
				util.log("There is a model passed");
				
			}

			var response = this.response;
			response.writeHead(200, {"Content-Type": "text/html"});
			
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
		}
	});
	return controllerBase;
})();