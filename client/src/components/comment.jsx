import React, { useState, useEffect } from "react";

import {getUserExtInfo} from "../services/auth.service";

import {removeComment} from "../services/contentManagement";

function Comment(params){

    const [displayName,setDisplayName]=useState();

    /*Setting inline style of control buttons, including edit and delete.
      The button are only displayed to the comment composer*/
    const controlButtonStyle={
        display:!(params.commentUserID===params.currentUserID)||params.fillerComment?"none":null,
        color:"#ffffff",
        marginLeft: "5px",
        marginBottom: "10px"
    };
    

    //Getting display name associated with the comment writer
    useEffect(()=>{
        getUserExtInfo(params.commentUserID,setDisplayName);
    },[displayName]);


    //Handling button clicks for edit and delete buttons
    function clickHandler(event) {
        //Name used to check which button has been clicked
        const {name}=event.target;
        if(name==="edit"){
        //Setting the passed comment ID through comment section to comment input to be included in the http request
        params.setCommentID(params.commentID);
        //Setting the passed comment content to provide intial input
        params.setCommentContent(params.content);
        //When set to false the button in comment input will switch from Add to Edit
        params.setEditTrigger(true);
        }
        //Remove comment
        if(name==="delete"){
            removeComment(params.commentID);
        }
    }



    return <div id={"comment-"+params.commentID} className="comment-body">
        {/*Using bootstrap to customize comment containers*/}
        <div className="comment-info d-block p-2 bg-primary text-white rounded-top">
            <div className="row">
            <div className="col">
                {/*If the comment writer set a display name, it will be shown instead of the username*/}
                <p>{displayName?displayName:params.commenter}</p>
            </div>
            <div className="col">
                {/*Displaying the date when the comment was submitted*/}
                <p style={{textAlign:"right"}}>{new Date(params.date).toLocaleDateString()}</p>
            </div>
            </div>
        </div>
        <div className="comment-content d-block p-2 comment-content">
            {/*Displaying the comment content and ensuring newlines would be printed*/}
            <p>{params.content.split("\n").map((sentence,index)=><span key={index}>{sentence}<br/></span>)}</p>
        </div>
        <div className="d-block p-2 text-white rounded-bottom comment-control">
            {/*Clicking this button will scroll user to the comment-input associated with the post*/}
            <a onClick={clickHandler} href={"#comment-input-"+params.commentID} className="btn btn-primary" style={controlButtonStyle} name="edit">Edit</a>
            {/*Clicking this button will scroll user to the associated post*/}
            <a onClick={clickHandler} href={"#post-"+params.postID} className="btn btn-danger" style={controlButtonStyle} name="delete">Delete</a>
        </div>
    </div>
}

export default Comment;
