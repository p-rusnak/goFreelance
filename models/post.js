var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    autor: String,
    title: String,
    descr: String,
    price: Number
});


module.exports = mongoose.model("Post", postSchema);