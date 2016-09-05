var http = require("http");
var url = require("url");
var util = require("util");
var session = require("./configuration/sessionManager");

//jeden session manager dla całego serwerka


function start(route, configuration){
	
	if(configuration.OnServerStart)
		configuration.OnServerStart();
	
	var sessionTime = 1200000; //domyślnie dwie minuty
	
	if(configuration.SessionTime) //pobieranie z pliku configuration
		sessionTime = configuration.SessionTime;
	
	var sessionManager = new session(sessionTime, configuration); 
	
	
	function onRequest(request, response){
		    
		    var userSession = sessionManager.CheckIfSessionExist(request, response);
		    
		    this.request = request;
		    this.response = response;
			this.pathName = url.parse(request.url).pathname;
			this.query = url.parse(request.url, true).query;
			this.session = userSession;
			if(configuration.OnEveryRequest){
			    //Założenie jest takie, że OnEveryRequest może zmienić całą trasę dla requesta
			    //Wrzucone do niego pathName, query, response i request mogą zostać zmodyfikowane,
			    //A ruch przekierowany gdzie indziej.
		        configuration.OnEveryRequest.call(this);
			}
			route(this.pathName, this.response, this.request, this.query, this.session, configuration);	
	}

	http.createServer(onRequest).listen(8080,function(err) {
    if (err) return cb(err);

    // Find out which user used sudo through the environment variable
    var uid = parseInt(process.env.SUDO_UID);
    // Set our server's uid to that user
    if (uid) process.setuid(uid);
    console.log('Server\'s UID is now ' + process.getuid());
  });

	console.log("Server started");
}

exports.start = start;