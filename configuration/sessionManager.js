module.exports = (function(){
    
    var sessionManager = function(sessionTime, configuration){
        this.Sessions = {};
        this.SessionTime = sessionTime;
        this.ServerConfig = configuration;
        //wartości sesji przetrzymywane są tylko i wyłącznie w pamięci serwera
        //po restarcie serwera wszystkie sesje przepadają
    }
    
    var sessionObject = function(request){
        this.SessionId = parseInt(Math.random() * new Date());
        this.SessionStartTime = new Date();
        this.UserAgent = request.headers["user-agent"];
        this.LastActivity = new Date();
        this._sessionStorage = {};
        this.Set = function(key, value){
            this._sessionStorage[key] = value;
        };
        this.Get = function(key)
        {
            return this._sessionStorage[key];   
        }
    }
    
    sessionManager.prototype.StartNewSession = function(request, response)
    {
        //tworzymy nowy identyfikator sesji
        //zapisujemy do tablicy sesji
        //Dodajemy cookie
        
        var newSession = new sessionObject(request);
        
        this.Sessions[newSession.SessionId] = newSession;
        
        if(this.ServerConfig && this.ServerConfig.OnSessionStart)
            this.ServerConfig.OnSessionStart.call(newSession, this);
        
        response.setHeader("Set-Cookie", ["glSes=" + newSession.SessionId + "; Path=/"]);
        
        return newSession;
    }
    
    sessionManager.prototype.AbandonSession = function(sessionId)
    {
        //usuwamy sesję z tablicy sesji
        delete this.Sessions[sessionId];
    }
    
    function getCookies(request){
        var list = {},
        rc = request.headers.cookie;

        rc && rc.split(';').forEach(function( cookie ) {
           var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    }
    
    sessionManager.prototype.CheckIfSessionExist = function(request, response)
    {
        var sessionId = getCookies(request)["glSes"];
        var currentSession = this.Sessions[sessionId];
        if(currentSession)
        {
            //Istnieje taka sesja, sprawdźmy czy nie wyczerpała się
            if((new Date() - currentSession.LastActivity) > this.SessionTime)
            {
                //Sesja się wyczerpała, usuwamy z tablicy sesji
                this.AbandonSession(currentSession.SessionId);
                return this.StartNewSession(request, response);
            }else
            {
                //Sesja się nie wyczerpała, odświeżamy czas ostatniej aktywności
                currentSession.LastActivity = new Date();
                return currentSession;
            }
        }else
        {
            return this.StartNewSession(request, response);            
        }
    }
    
    return sessionManager;
    
})()