module.exports = (function () {
	var util = require("util");	
	var controllerBase = require("../main/controllerBase");
	var extend = require("extend");

	util.inherits(homeController, controllerBase);
	function homeController(controllerParams){		
		
		controllerBase.call(this,controllerParams);
		//Tutaj jest miejsce dla wstawiania własnych flag
		this.restrictedFunctions = [];
		
	}
	

	extend(homeController.prototype, {
		folder: "home",
		index: function(queryMap){
			console.log(this.session);
			var that = this;
			if (this.request.method === "POST"){
				console.log("POST FORM");
				console.log(queryMap);

			}			
			this.renderHtmlView("index", {"name": "Tomasz"});
		},
		loop: function(queryMap){
			console.log("Jestem tutaj");
			this.returnJson(queryMap);
		},
		witaj: function(){
			this.renderEJS("witaj", {name: this.session.Get("userName")});
		},
		jadeTest: function(queryMap){
			queryMap.pageTitle = "Jade test page";
			this.renderJadeView("jadeTest", queryMap);
		},
		formSubmit: function(queryMap){
			var options = {
				locals:queryMap				
			}
			this.renderJadeView("submitForm", options);
		}
	});
	console.log(homeController);

	return homeController;

})();