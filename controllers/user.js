module.exports = (function () {
	var util = require("util");
	var controllerBase = require("../main/controllerBase");
	var extend = require("extend");
	function homeController(controllerParams){		
		controllerBase.call(this, controllerParams);
	}
	util.inherits(homeController, controllerBase);
	extend(homeController.prototype, {
		folder: "user",
		index: function(){
			this.renderView("index", {"name": "Tomasz"});
		},
		nowy: function(){
			this.renderView("nowy");
		}
	})
 
 	return homeController;

})();