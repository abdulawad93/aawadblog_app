import React, { useState, useEffect } from "react";
import {addComment, editComment} from "../services/contentManagement.js";
import $ from "jquery";

function CommentInput(params){

    //State to store comment input text
    const [commentText,setCommentText]= useState();

    //Rendering comment content if edit button was clicked. It rerender everytime the comment ID passed change it's value
    useEffect(()=>{
        if(params.editTrigger)
            setCommentText(params.commentContent)
    },[params.editTrigger,params.commentID]);

    //Storing comment input changes
    function handleChange(event){
        setCommentText(event.target.value);
    }

    function handleSubmit(event){
        //Checking if commentText has value. If no value, nothing will be submitted
        if(commentText){
        //If submitting a new comment
        if(!params.editTrigger){
        addComment(commentText,params.currentUserID,params.postID,params.user);
        }
        //If editting an existing comment
        if(params.editTrigger){
            editComment(commentText,params.commentID);
            //setEditTrigger will switch button text from Edit to Add
            params.setEditTrigger(false);
            //scroll to the edited comment
            const commentID=$("#comment-"+params.commentID);
            $('html,body').animate({scrollTop: commentID.offset().top});
        }
        }
        //Clear comment text value after submission
        setCommentText("");
        event.preventDefault();
    }

    //Switching background color when edit button clicked to get user's attention
    const textAreaStyle={
        backgroundColor:params.editTrigger&&"#b2ebf2"
    }


    return <div>
    {/*Form to submit comment*/}
    <form onSubmit={handleSubmit} id={"comment-input-"+params.commentID} className="comment-input-div" encType="text/plain">
        <textarea type="text" onChange={handleChange} autoComplete="off" className={"comment-input-text"} rows="1" style={textAreaStyle} value={commentText}/>
        {/*The button switches between add and edit depending on editTrigger value*/}
        <button className="comment-input-btn" type="submit">{params.editTrigger?<i class="fas fa-edit"></i>:<i class="fas fa-plus-circle"></i>}</button>
    </form>
    </div>
}

export default CommentInput;