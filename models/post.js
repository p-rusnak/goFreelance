var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    author: String,
    title: String,
    descr: String,
    price: Number,
    date : Date,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Post", postSchema);