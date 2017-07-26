var express  = require("express"),
    mongoose = require("mongoose");

var routes = express();


var Post = require("./models/post"),
    seedDB = require("./seeds");
    
    
seedDB();


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gf_db', {useMongoClient: true});


routes.set("view engine", 'ejs');
routes.use(express.static(__dirname + "/public"));

routes.get("/", function(req, res){
   res.render("home"); 
});



routes.get("/offers", function(req, res){
    Post.find({}, function(err, item){
        if(err){
            console.log("error");
        } else {
            res.render("offers", {posts: item});
        }
    });
})

routes.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server runnning");
});
