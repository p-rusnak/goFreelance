var express = require("express"),
    passport      = require("passport"),
    routes  = express.Router();
    
var User    = require("../models/user");
    
routes.get("/", function(req, res){
    console.log("visit");
   res.render("home"); 
});





routes.get("/register", function(req, res) {
   res.render("register"); 
});

routes.post("/register", function(req, res){
   User.register(new User(
       {username: req.body.username.toLowerCase()}),
        req.body.password, function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            }
                passport.authenticate("local")(req, res, function(){
                res.redirect("offers");
                });   
        }); 
});

routes.get("/login", function(req, res) {
   res.render("login"); 
});

routes.post("/login",usernameToLowerCase, passport.authenticate("local", 
                    {successRedirect: "/offers", failureRedirect: "/login"}),
                    function(req, res) {
                        res.render("login"); 
});

routes.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});

function usernameToLowerCase(req, res, next){
    req.body.username = req.body.username.toLowerCase();
    next();
}
        
        
module.exports = routes;