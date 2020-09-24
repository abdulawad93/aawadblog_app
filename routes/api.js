//requiring package
const express=require("express");
const bodyParser=require("body-parser");
const router=express.Router();


router.use(bodyParser.urlencoded({extended:true}));


//Importing related models
const Post=require("../models/model.post.js");
const Comment=require("../models/model.comment.js");

//Getting all posts to be displayed in the feed page
router.get("/get-posts",(req,res)=>{Post.find({}).then((foundPosts)=>res.json(foundPosts)).catch(err=>res.json(err))});


//Getting posts posted by specific user to be displayed on their profile pages 
router.post("/get-posts-by-user-id",(req,res)=>Post.find({userID:req.body.userID}).then((foundPosts=>res.json(foundPosts))).catch(err=>res.json(err)));

//Adding a new post document to MongoDB post collection
router.post("/create-post",(req,res)=>{
  const date=new Date();
  const post=new Post({
    title:req.body.title,
    content:req.body.content,
    publisher:req.body.publisher,
    userID:req.body.userID,
    dateAdded:date
  });

  post.save().then(()=>{res.json("Post Added!")}).catch(err=>res.json(err));
});

//Deleting specific post by looking up the post's id
router.delete("/delete-post/:postID",(req,res)=>{
  Post.findByIdAndDelete(req.params.postID).then(()=>{res.json("A post with id "+ req.params.postID + " was deleted.")}).catch(err=> res.json(err))
});

//Editing specific post by looking up the post's id
router.patch("/edit-post",(req,res)=>{
  Post.findByIdAndUpdate(req.body._id,{$set: req.body}).then(()=>{res.json("Post with ID: "+req.body._id+"was updated.")}).catch(err=> res.json(err));
});

//Comments

//Creating and adding a new comment document to mongoDB comment collection
router.post("/add-comment",(req,res)=>{
  const date=new Date();
  const comment=new Comment({
    content:req.body.content,
    owner:req.body.commenter,
    userID:req.body.userID,
    relatedPostID:req.body.postID,
    dateAdded:date
  });
  comment.save().then(()=>{res.json("Comment Added!")}).catch(err=>err.json(err));
});


//Gettings all comment attached to specific post ID
router.post("/get-comments",(req,res)=>{Comment.find({relatedPostID:req.body.postID}).then(foundComments=>res.json(foundComments)).catch(err=>res.json(err))});

//Editing comment by looking up it's comment id
router.patch("/edit-comment",(req,res)=>{Comment.findByIdAndUpdate(req.body.commentID,{$set: req.body}).then(()=>{res.json("Comment with ID: "+req.body.commentID+"was updated.")}).catch(err=>res.json(err))});

//Deleting comment by looking up it's comment id
router.delete("/delete-comment/:commentID",(req,res)=>{
  Comment.findByIdAndDelete(req.params.commentID).then(()=>{res.json("A comment with id "+ req.params.commentID + " was deleted.")}).catch(err=> res.json(err))
});


//Likes


//Getting a list of likers user IDs to be compared with the user ID stored in the browser's local storage 
router.post("/get-likers-list",(req,res)=>{Post.findById(req.body.postID).then((foundLikers)=>res.json(foundLikers.forEach(foundLikerID)))});


//Adding a new link by adding user ids to the post with the specific post id
router.post("/add-like",(req,res)=>{
  Post.findByIdAndUpdate(req.body.postID,{$push: {likers:req.body.userID}}).then(()=>res.json("New like has been recorded to post "+req.body.postID+" by user "+req.body.userID)).catch(err=>res.json(err));
});

//Unlike by removing a user ID from the likers array
router.delete("/remove-like/user/:userID/post/:postID",(req,res)=>{
  Post.findByIdAndUpdate(req.params.postID,{$pull: {likers:req.params.userID}}).then(()=>res.json("A like has been removed from post "+req.params.postID+" by user "+req.params.userID)).catch(err=>res.json(err));
});




module.exports=router;
