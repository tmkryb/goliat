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
		index: function(queryMap){
			this.renderEJS("index");
		},
		logout: function(queryMap){
			var that = this;
			this.session.Get("authManager").Logout(this.session.Get("loggedUser"), function(){
				var userName = that.session.Get("loggedUser").Login;
				that.session.Set("isLoggedIn", false);
				that.session.Set("loggedUser", null);
				that.renderEJS("userLoggedOut", {userName: userName});
			});
		},
		login: function(queryMap){
			var that = this;
			this.session.Get("authManager").LoginUser(queryMap.login, queryMap.password, function(message){
			if(message.val){
				var authMan = that.session.Get("authManager");
				that.session.Set("isLoggedIn", true);
				authMan.GetUserByLogin(queryMap.login, function(err, user){
					that.session.Set("loggedUser", user);
				});
				that.renderEJS("userLoggedIn", {userName: queryMap.login});
			}
			else
				that.renderEJS("userNotFound", {userName: queryMap.login});
			});
		},
		register: function(queryMap){
			//dostajemy email, login, haslo, drugie haslo
			
			var authMan = this.session.Get("authManager");
			if (queryMap.password == queryMap.secondPassword){
			
				authMan.RegisterNewUser(queryMap.login, queryMap.email, queryMap.name, queryMap.surname, queryMap.password);
				this.session.Set("isLoggedIn", true);
				var that = this;
				authMan.GetUserByLogin(queryMap.login, function(err, user){
					that.session.Set("loggedUser", user);
					that.renderEJS("userLoggedIn", {userName: queryMap.login});
				});
				
				
			}else
				this.renderEJS("message", {message: "Password dont match!"})
		}
		
	})
 
 	return homeController;

})();