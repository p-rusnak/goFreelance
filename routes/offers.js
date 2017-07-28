var express = require("express"),
    routes  = express.Router();
    
var Post    = require("../models/post"),
    User    = require("../models/user"),
    Comment = require("../models/comment");


var middleware = require("../middleware/logged.js");



routes.get("/", function(req, res){
    var page = 1,
        searchString,
        sorting = 1;
    //sorting = req.query.q;
    if(req.query.s){ searchString = "&s=" + req.query.s; }
    var params = {
        sort : sorting,
        search : searchString
    };
    if(req.query.p){
        page = req.query.p;
    }
    Post.find({}, function(err, item){
        var items = new Array;
        if(err){
            console.log("error");
        } else {
             if(req.query.s){
                
                var rel = [0];
                item.forEach(function(post){
                    var relevancy = search(post, req.query.s);
                   if ( relevancy > 0){
                        for(var i = 0; i <= items.length; i++){
                            if(rel[i] <= relevancy){
                                rel.splice(i, 0, relevancy);
                                items.splice(i, 0, post);
                                break;
                            }
                        }
                   }
                 });
                 
                res.render("offers/offers", {posts: items, page: page, params: params});
            }  else {
            var price = [-1];
            var date = [0];
            item.forEach(function(post){
                switch(sorting) {
                    case 0:
                        for(var i = 0; i < items.length; i++){
                            if(date[i] >= post.date.getTime() ){
                                // price.splice(i, 0, post.price);
                                // items.splice(i, 0, post);
                                break;
                            }
                        }
                        date.splice(i, 0, post.date.getTime());
                        items.splice(i, 0, post);

                        break;    
                    case 1:
                        if ( post.date.getTime() > 0){
                            for(var i = 0; i <= items.length; i++){
                                if(date[i] <= post.date.getTime()){
                                    date.splice(i, 0, post.date.getTime());
                                    items.splice(i, 0, post);
                                    break;
                                }
                            }
                        }
                        break;
                    case 2:
                        for(var i = 0; i < items.length; i++){
                            if(price[i] >= post.price ){
                                // price.splice(i, 0, post.price);
                                // items.splice(i, 0, post);
                                break;
                            }
                        }
                        price.splice(i, 0, post.price);
                        items.splice(i, 0, post);

                        break;    
                    case 3:
                        if ( post.price > 0){
                            for(var i = 0; i <= items.length; i++){
                                if(price[i] <= post.price){
                                    price.splice(i, 0, post.price);
                                    items.splice(i, 0, post);
                                    break;
                                }
                            }
                        }
                        break;
                    default:
                        items.unshift(post);
                }
                
            });
            res.render("offers/offers", {posts: items, page: page, params: params});
            }
        }
    });
});

routes.post("/", middleware.isLoggedIn, function(req, res){
    if( req.body.title == "" || req.body.descr == "" || req.body.price == ""){
        res.redirect("/offers/new");
    } else {
        Post.create({
            author: req.user.username,
            title: req.body.title,
            descr: req.body.descr,
            price: req.body.price,
            date : Date.now()
        }, function(err, item){
            if(err){
                console.log("error");
                res.render("offers/new");
            } else {
                res.render("offers/show", {post: item, status: false});
            }
        });
    }
});

routes.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("offers/new");
});





function search(object, wordRequest){
    var relevancy = false;
    var text = object.title.split(" ");
    text.push.apply(text, object.descr.split(" "));
    wordRequest = wordRequest.split(" ");
    wordRequest.forEach(function(wordRequested){
        text.forEach(function(word){
            word = word.replace(/,|\.|\?|!|\"/g, "");
           if(word.toLowerCase() == wordRequested.toLowerCase()){
                relevancy++;
           }
        });
    });
    return relevancy;
}



module.exports = routes;