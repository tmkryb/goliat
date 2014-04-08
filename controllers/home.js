module.exports = (function () {
	var util = require("util");	
	var controllerBase = require("../main/controllerBase");
	var extend = require("extend");

	function homeController(response, path, query){
		this.response = response;
		this.path = path;
		this.query = query;
		controllerBase.call(this);
	}
	util.inherits(homeController, controllerBase);
	extend(homeController.prototype, {
		folder: "home",
		index: function(queryMap){
			console.log(queryMap);
			this.renderView("index", {"name": "Tomasz"});
		},
		loop: function(queryMap){
			console.log("Jestem tutaj");
			this.returnJson(queryMap);
		},
		witaj: function(){
			this.renderView("witaj");
		}
	})
 
 	return homeController;

})();