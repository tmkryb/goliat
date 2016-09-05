module.exports = (function () {
	var util = require("util");	
	var controllerBase = require("../main/controllerBase");
	var extend = require("extend");

	util.inherits(homeController, controllerBase);
	function homeController(controllerParams){	
		
		controllerBase.call(this,controllerParams);
		//Tutaj jest miejsce dla wstawiania własnych flag
		if(!this.session.Get("isLoggedIn"))
		{
			this.renderEJS("accessRestricted");
			return;
		}
		this.restrictedFunctions = [];
		
	}
	

	extend(homeController.prototype, {
		folder: "workbench",
		index: function(queryMap){
			
			this.renderEJS("index", {session: this.session});
		},
		customerList: function(queryMap){
			var dbClient = this.session.Get("mongodb");
			var that = this;
			dbClient.Execute(function(err, db){
				db.collection("Customers").find(function(err, customers){
					that.renderEJS("customerList", {customers: customers});
				})
			})
		},
		customerAdd: function(queryMap)
		{
			this.renderEJS("addCustomer");
		},
		addCustomerPOST: function(queryMap)
		{
			var dbClient = this.session.Get("mongodb");
			var that = this;
			dbClient.Execute(function(err, db){
				db.collection("Customers").insert(queryMap);
			});
			this.index(queryMap);
		}
		
	});
	

	return homeController;

})();