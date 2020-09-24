import React, { useEffect, useState } from "react";
import {getComments} from "../services/contentManagement.js";
import axios from "axios";
import Comment from "./comment.jsx";
import CommentInput from "./commentInput.jsx";
import $ from "jquery";

function CommentSection(params) {
    const [comments,setComments]=useState([]);
    
    //Use State Hooks to be used to comment editting feature
    const [commentContent,setCommentContent]=useState("");
    const [commentID,setCommentID]=useState("");
    const [editTrigger,setEditTrigger]=useState(false);
    const [editAttemptedFlag,setEditAttemptedFlag]=useState(false);
    
    //Rerendering Flag

    /*Continuous rerendering of comments and storing in comments state. 
    Source is used to remove resources and to avoid error that occurs when removing a post*/
    
    useEffect(()=>{
        const source = axios.CancelToken.source();
        getComments(params.postID,comments,setComments,params.setNumberOfComments,source);
        return (() => {
            source.cancel();
        });
    },[comments,params.postID]);


    /*Adding jquery animation to scroll the user to the comment section and fade the comment section in and out 
    depending on display mode value. Display Mode value is toggled by comments button in comment component*/
    useEffect(()=>{
        const commentSection=$("#comments-section-"+params.postID);
        if(params.displayMode){
            commentSection.fadeIn();
            $('html,body').animate({scrollTop: commentSection.offset().top})
        }
        if(!params.displayMode){
            commentSection.fadeOut();
        }
    },[params.displayMode])
    
    return <div id={"comments-section-"+params.postID} >

    {/* Comment Input */}
    <div className="container-fluid">
        <CommentInput currentUserID={params.currentUserID} postID={params.postID} user={params.user} commentID={commentID} commentContent={commentContent} editTrigger={editTrigger} setEditTrigger={setEditTrigger}  setEditAttemptedFlag={setEditAttemptedFlag}/>

    {/* Comment Body */}
    {/*If no comment has been published, default message of 'write the first comment' appear*/}
    {comments.length>0?comments.map((comment,index)=><Comment key={index} commentID={comment._id} commenter={comment.owner} date={comment.dateAdded} content={comment.content} commentUserID={comment.userID} currentUserID={params.currentUserID} fillerComment={false} setCommentID={setCommentID} setCommentContent={setCommentContent} setEditTrigger={setEditTrigger} editAttemptedFlag={editAttemptedFlag} setEditAttemptedFlag={setEditAttemptedFlag} postID={params.postID}/>)
    :<Comment commenter={"AAWAD Blog"} date={new Date().toLocaleDateString()} content={"Write the first comment!"} fillerComment={true}/>}
    </div>
    </div>
}

export default CommentSection;
