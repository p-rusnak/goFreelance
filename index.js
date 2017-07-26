var express       = require("express"),
    mongoose      = require("mongoose"),
    bodyParser    = require("body-parser"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local");

var routes = express();

var Post    = require("./models/post"),
    User    = require("./models/user"),
    Comment = require("./models/comment"),
    seedDB  = require("./seeds");
    
    
seedDB();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gf_db', {useMongoClient: true});


routes.set("view engine", 'ejs');
routes.use(express.static(__dirname + "/public"));
routes.use(bodyParser.urlencoded({extended: true}));

routes.use(require("express-session")({
    secret: "No idea",
    resave: false,
    saveUninitialized: false
}));
routes.use(passport.initialize());
routes.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
routes.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});




routes.get("/", function(req, res){
   res.render("home"); 
});


routes.get("/offers", function(req, res){
    Post.find({}, function(err, item){
        if(err){
            console.log("error");
        } else {
            res.render("offers/offers", {posts: item});
        }
    });
});

routes.post("/offers", isLoggedIn, function(req, res){
    Post.create({
        author: req.body.author,
        title: req.body.title,
        descr: req.body.descr,
        price: req.body.price
    }, function(err, item){
        if(err){
            console.log("error");
            res.render("offers/new");
        } else {
            res.render("offers/show", {post: item});
        }
    });
});

routes.get("/offers/new", isLoggedIn, function(req, res) {
    res.render("offers/new");
});

routes.get("/offers/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            res.send("Id not found");
        } else {
            res.render("offers/show", {post: foundPost});
        }
    });
});


routes.post("/offers/:id/comments", isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
            var comment = {
                author : req.user.username,
                context : req.body.context,
                date : Date.now()
            }
            Comment.create(comment, function(err, comment){
               if(err) {
                   console.log(err)
               } else {
                   post.comments.push(comment);
                   post.save();
                   res.redirect("/offers/"+post._id);
               }
            });
        }
    });
});


routes.get("/register", function(req, res) {
   res.render("register"); 
});

routes.post("/register", function(req, res){
   User.register(new User(
       {username: req.body.username}),
        req.body.password, function(err, user){
            if(err){
                console.log(err)
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

routes.post("/login", passport.authenticate("local", 
                    {successRedirect: "/offers", failureRedirect: "/login"}),
                    function(req, res) {
                        res.render("login"); 
});

routes.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});

routes.get("/*", function(req, res) {
   res.send("404 not found"); 
});

routes.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Server runnning");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};