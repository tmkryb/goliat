module.exports = (function(){
    var crypto = require("crypto");
    var underscore = require("underscore");
    //var dbHelper = require()
    var authMan = function(databaseClient){
        this.LoggedUsers = [];
        this.DatabaseClient = databaseClient;
    }
    
    authMan.User = function(login, email, name, surname, password){
        this.Id = parseInt(Math.random() * new Date());
        this.Name = name;
        this.Email = email;
        this.Surname = surname;
        this.Login = login;
        this.Groups = [];
        this.LoggedIn = false;
        this.Password = crypto.createHash('md5').update(password).digest("hex");
    }
    
    authMan.Group = function(name)
    {
        this.Id = (parseInt(Math.random() * new Date()));
        this.Name = name;
        this.Users = []; //tablica identyfikatorów
        this.Roles = []; //tablica identyfikatorów
    }
    
    authMan.Role = function(name)
    {
        this.Id = (parseInt(Math.random() * new Date()));
        this.Name = name;
        this.Groups = []; //tablica identyfikatorów
    }
    
    authMan.prototype.GetAllGroups = function(callback){
        var that = this;
        var clb = callback;
        this.DatabaseClient.Execute(function(err, db){
            db.collection("Groups").find(function(err, groups){
                that.AllGroups = groups;
                clb(err, groups);
            })
            
        });
    }
    
    authMan.prototype.GetGroupByName = function(name, callback){
        var that = this;
        var clb = callback;
        this.DatabaseClient.Execute(function(err, db){
            return db.collection("Groups").findOne({ Name: name }, clb)
        });
    }
    
    authMan.prototype.GetGroupById = function(id, callback){
        var that = this;
        var clb = callback;
        this.DatabaseClient.Execute(function(err, db){
            return db.collection("Groups").findOne({ Id: id }, clb)
        });
    }
    
    authMan.prototype.GetUserByLogin = function(userLogin, callback){
        var clb = callback;
        var that = this;
        this.DatabaseClient.Execute(function(err, db){
            if(clb)
                db.collection("Users").find({ Login: userLogin }, clb.bind(that));
            
                
            
        });
    }
    
    authMan.prototype.GetRoleByName = function(roleName, callback){
        var clb = callback;
        this.DatabaseClient.Execute(function(err, db){
            return db.collection("Roles").find({ Name: roleName }, clb);
        });
    }
    
    authMan.prototype.UpsertGroup = function(group){
        var that = this;
        this.DatabaseClient.Execute(function(err, db){
            db.collection("Groups").update({Id: group.Id}, group, {upsert: true});
        });
    }
    
    authMan.prototype.UpsertUser = function(user, callback){
        var that = this;
        var clb = callback;
       
        this.DatabaseClient.Execute(function(err, db){
            if(clb)
                db.collection("Users").update({Id: user.Id}, user, {upsert: true}, clb);
            else
                db.collection("Users").update({Id: user.Id}, user, {upsert: true});
        });
    }
    
    authMan.prototype.UpsertRole = function(role){
        var that = this;
        this.DatabaseClient.Execute(function(err, db){
            db.collection("Roles").update({Id: role.Id}, role, {upsert: true});
        });
    }
    
    authMan.prototype.GetAllUsers = function(callback){
        var that = this;
        var clb = callback;
        this.DatabaseClient.Execute(function(err, db){
            that.AllUsers = db.collection("Users").find(function(err, users){
                that.AllUsers = users;
                clb(err, users);
            })
        });
    }
    
    authMan.prototype.GetAllRoles = function(callback){
        var that = this;
        var clb = callback;
        this.DatabaseClient.Execute(function(err, db){
          db.collection("Roles").find(function(err, roles){
                that.AllRoles = roles;
                clb(err, roles);
          })
            
        });
    }
    
    
    
    authMan.prototype.RegisterNewUser = function(login, email, name, surname, password)
    {
        var newUser = new authMan.User(login, email, name, surname, password);
        newUser.LoggedIn = true; //od razu logujemy użytkownika
        this.DatabaseClient.Execute(function(err, db){
                    db.collection("Users").insert(newUser, function(){
                        return newUser;   
                    });
                });
    }
    
    authMan.prototype.AddNewRole = function(roleName){
        var newRole = new authMan.Role(roleName);
        this.DatabaseClient.Execute(function(err, db){
                    db.collection("Roles").insert(newRole, function(){
                        return newRole;   
                    });
                });
    }
    
    authMan.prototype.AddGroup = function(groupName, roles){
        var newGroup = new authMan.Group(groupName);
        this.DatabaseClient.Execute(function(err, db){
                    db.collection("Roles").insert(newGroup, function(){
                        return newGroup;   
                    });
                });
    }
    
    authMan.prototype.AddUserToGroup = function(user, groupName)
    {
        //odśwież z bazy
        var group = this.GetGroupByName(groupName);
        if(user.Groups.indexOf[group.Id] != -1){
            user.Groups.push(group.Id);
            group.Users.push(user.Id);
        }
        this.UpsertGroup(group);
        this.UpsertUser(user);
    }
    
    authMan.prototype.AddRoleToGroup = function(role, groupName)
    {
        //odśwież z bazy
        var group = this.GetGroupByName(groupName);
        if(role.Groups.indexOf[group.Id] != -1){
            role.Groups.push(group.Id);
            group.Users.push(role.Id);
        }
        this.UpsertGroup(group);
        this.UpsertRole(role);
    }
    
    authMan.prototype.LogoutUser = function(loggedUser, callback)
    {
        loggedUser.LoggedIn = false;
        this.UpsertUser(loggedUser, callback);
        
    }
    
    authMan.prototype.LoginUser = function(userLogin, password, callback){
        var clb = callback;
        this.GetUserByLogin(userLogin, function(err,users){
        var user = users[0];
        if(!user)
        {
            clb({val: false, message: "User don't exist"});  
            return;
        }
        
        var hashPass = crypto.createHash('md5').update(password).digest("hex");
        
        if(user.Password === hashPass)
        {
            user.LoggedIn = true;
            this.UpsertUser(user);
            clb({val: true, message: "User Successfully logged in"});
        }else
        {
            user.LoggedIn = false;
            this.UpsertUser(user);
            clb({val: false, message: "Password don't match with userLogin"});           
        }
        });
    }
    
    authMan.prototype.IsUserInRole = function(userLogin, roleName)
    {
        var userGroupsIds = this.GetUserByLogin(userLogin).Groups;
        
        var userRoles = [];
        for (var i = userGroupsIds.length; i--; ) {
            userRoles.concat(this.GetGroupById(userGroupsIds[i]).Roles);
        }
        
        var role = this.GetRoleByName(roleName)
        
        return underscore.contains(userRoles, role.Id);
    }
    
    return authMan;
    
})()