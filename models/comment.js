var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    author: String,
    context: String,
    date: Date
});


module.exports = mongoose.model("Comment", commentSchema);