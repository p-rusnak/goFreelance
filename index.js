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
    
    
//seedDB();

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
    var page = 1;
    if(req.query.p){
        page = req.query.p;
    }
    Post.find({}, function(err, item){
        var items = new Array;
        if(err){
            console.log("error");
        } else {
             if(req.query.s){
                item.forEach(function(post){
                    var relevancy = search(post, req.query.s);
                   if ( relevancy > 0){
                        var rel = [0];
                        for(var i = 0; i <= items.length; i++){
                            if(rel[i] < relevancy){
                                rel.unshift(relevancy);
                                
                                items.unshift(post);
                                break;
                                console.log(rel);
                            }
                        }
                       
                         console.log(items);
                   }
                 });
                 
                res.render("offers/offers", {posts: items, page: page});
            }  else {
            res.render("offers/offers", {posts: item, page: page})
            }
        }
    });
});

routes.post("/offers", isLoggedIn, function(req, res){
    if( req.body.title == "" || req.body.descr == "" || req.body.price == ""){
        res.redirect("/offers/new")
    } else {
        Post.create({
            author: req.user.username,
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
    }
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
    if( req.body.context == "" ||  req.body.price == ""){
        res.redirect("/offers/"+req.params.id)
    } else {
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
    }
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

function search(object, wordRequest){
    var relevancy = false;
    var text = object.title.split(" ");
    text.push.apply(text, object.descr.split(" "));
    wordRequest = wordRequest.split(" ");
    wordRequest.forEach(function(wordRequested){
        text.forEach(function(word){
           if(word.toLowerCase() == wordRequested.toLowerCase()){
                relevancy++;
           }
        });
    });
    return relevancy;
};