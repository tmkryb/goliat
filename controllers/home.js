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
		index: function(){
			this.renderView("index", {"name": "Tomasz"});
		}
	})
 
 	return homeController;

})();