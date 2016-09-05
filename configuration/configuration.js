module.exports = (function () {
    return{
        //Tutaj umieszczać globalne zmienne konfiguracyjne dla serwerka
        ServerKeys: { ConnectionString : "mongodb://localhost:27017/local" },
        OnServerStart: function(){ 
            
            console.log("Launching OnServerStart");
        },
        OnEveryRequest: function(){
            //Ta metoda działa w kontekście funkcji onRequest
            //Dostępne właściwości:
            //this.response
            //this.request
            //this.query
            //this.pathName
            //this.session
            
            //zapis wszystkich odwiedzin
            if(this.session)
            {
                var mongo = this.session.Get("mongodb");
                if(mongo){
                var that = this;
                mongo.Execute(function(err, db){
                    db.collection("allRequests").insert({
                        "Path": that.pathName,
                        "SessionId": that.session.SessionId,
                        "DateTime": new Date()
                    }, function(){
                        ;
                    });
                    
                })
                }else
                {
                    this.session.Set("mongodb", new require("./main/dbProcessing/dbHelper")(this.session.ServerConfig.ServerKeys.ConnectionString));    
                }
            }
            
            console.log("Launching OnEveryRequest");
        },
        OnSessionStart: function(newSession){
            //Ta metoda działa w kontekście nowo tworzonej sesji.
            //Dostępne są funkcje Set i Get
            
            //rozpocznij sesję authManagera
            var authMan = require("../main/dbProcessing/authManager");
            var mongoClient = new (require("../main/dbProcessing/dbHelper"))(newSession.ServerConfig.ServerKeys.ConnectionString);
            
            this.Set("authManager", new authMan(mongoClient));
            this.Set("connString", newSession.ServerConfig.ServerKeys.ConnectionString);
            this.Set("mongodb", mongoClient);
            
            console.log("Launching OnSessionStart");
        }
        
        
    }
})()