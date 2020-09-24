const mongoose=require("mongoose");

//Defining post schema
const postSchema=new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  dateAdded: {
    type: Date,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  likers: [String]
});

const Post=mongoose.model("Post",postSchema);
module.exports=Post;
