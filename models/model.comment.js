const mongoose=require("mongoose");

//Defining comment schema
const commentSchema=new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    relatedPostID: {
        type: String,
        required: true
    }
});

const Comment=mongoose.model("Comment",commentSchema);
module.exports=Comment;