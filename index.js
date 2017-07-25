var express = require("express");

var routes = express();

routes.set("view engine", 'ejs');
routes.use(express.static(__dirname + "/public"));

routes.get("/", function(req, res){
   res.render("home"); 
});


routes.get("/offers", function(req, res){
    res.send("offers get route, soon to add offers from database");
})

routes.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server runnning");
});
