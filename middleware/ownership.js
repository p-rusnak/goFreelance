var middlewareObject = {};
var Post    = require("../models/post");


middlewareObject.offer = function (req, res, next){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            if(req.user.username == foundPost.author){
                return next();
            }
        res.redirect("/offers/"+foundPost._id);
            
        }
    });
};

middlewareObject.comment = function (req, res, next){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            if(req.user.username == foundPost.author){
                return next();
            }
        res.redirect("/offers/"+foundPost._id);
            
        }
    });
};

module.exports = middlewareObject;