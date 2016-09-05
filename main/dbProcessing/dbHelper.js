module.exports = (function(){
    
    //Metody wspomagające działanie bazy danych - dla większej przejrzystości kodu
    var dbHelper = function(connectionString){
        this.ConnectionString = connectionString;    
    }
    
    dbHelper.prototype.Execute = function(callback)
    {
        //require('mongodb').MongoClient.connect(this.ConnectionString, callback);
        var mongojs = require('mongojs');
        var db = mongojs(this.ConnectionString);
        callback(null, db);
    }
    
    
    return dbHelper;
    
    
    
})()