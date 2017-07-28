var express = require("express"),
    routes  = express.Router({mergeParams: true});
    
var Post    = require("../models/post"),
    User    = require("../models/user"),
    Comment = require("../models/comment");

var middleware = require("../middleware/logged.js");    
    
routes.get("/", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            res.send("Id not found");
        } else {
            var commentingStatus = true;
            if(req.user != undefined){
                if(req.user.username != foundPost.author){
                    foundPost.comments.forEach(function(comment){
                        if(comment.author == req.user.username){
                            commentingStatus = false;
                        }
                    });
                } else {
                    commentingStatus = false;
                }
            } else {
                commentingStatus = false;
            }

            res.render("offers/show", {post: foundPost, status: commentingStatus});
        }
    });
});

    
routes.post("/comments", middleware.isLoggedIn, function(req, res) {
    if( req.body.context == "" ||  req.body.price == ""){
        res.redirect("/offers/"+req.params.id);
    } else {
    Post.findById(req.params.id).populate("comments").exec(function(err, post){
        if(err){
            console.log(err);
        } else {
            var canComment = true;
            post.comments.forEach(function(comm){
              if(req.user.username == comm.author){
                  canComment = false;
              } 
            });
            if(canComment == true){
                var comment = {
                    author : req.user.username,
                    context : req.body.context,
                    date : Date.now()
                };
                Comment.create(comment, function(err, comment){
                   if(err) {
                       console.log(err);
                   } else {
                       post.comments.push(comment);
                       post.save();
                       res.redirect("/offers/"+post._id);
                   }
                });
            } else {
                res.redirect("/offers/"+req.params.id);
            }
        }
    });
    }
});


module.exports = routes;