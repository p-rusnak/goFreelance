var express        = require("express"),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    passport       = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local");
var User           = require("./models/user");
var commentRoutes  = require("./routes/comments"),
    offerRoutes    = require("./routes/offers"),
    indexRoutes    = require("./routes/index");
    
var routes = express();
// var clearDB  = require("./dbErase");
// clearDB();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gf_db', {useMongoClient: true});


routes.set("view engine", 'ejs');

routes.use(methodOverride("_method")); 
routes.use(express.static(__dirname + "/public"));
routes.use(bodyParser.urlencoded({extended: true}));
routes.use(require("express-session")({
    secret: "No idea",
    resave: false,
    saveUninitialized: false
}));
routes.use(passport.initialize());
routes.use(passport.session());
routes.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


routes.use(indexRoutes);
routes.use("/offers", offerRoutes);
routes.use("/offers/:id", commentRoutes);

routes.get("/*", function(req, res) {
   res.send("404 not found"); 
});


routes.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server runnning");
});



