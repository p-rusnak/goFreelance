var mongoose = require("mongoose"),
    Post     = require("./models/post"),
    User     = require("./models/user"),
    Comment  = require("./models/comment");

function clearDB(){
    
    //drop the table
    
    Post.remove({}, function(err){
        if(err){
            console.log("Error");
        } else {
            console.log("All posts removed");
        }
    });
    
    User.remove({}, function(err){
       if(err){
           console.log("Error");
       } else {
           console.log("All users removed");
       }
    });
    
    Comment.remove({}, function(err){
       if(err){
           console.log("Error");
       } else {
           console.log("All comments removed");
       }
    });
    
}

module.exports = clearDB;