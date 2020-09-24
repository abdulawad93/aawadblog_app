import React, { useState} from "react";
import $ from "jquery";
import {addPost} from "../services/contentManagement.js";

function NewPostInput(params) {
    //Saving post input in an array
    const [postInfo,setPostInfo]=useState({title:"",content:""});
    //Flags to check if content and title has value
    const [contentMissing,setContentMissing]=useState(false);
    const [titleMissing,setTitleMissing]=useState(false);
    
    //Fires when change happens to either title or content
    function changeHandler(event){
        const {name,value}=event.target;
        setPostInfo(prevValue=>name==="title"?{title:value,content:prevValue.content}
        :name==="content"&&{title:prevValue.title,content:value});
    }

    function submitHandler(event) {
        //Flags reset everytime submit happens
        setContentMissing(false);
        setTitleMissing(false);
        
        //If title and content has values submit value to mongoDB
        if(postInfo.title&&postInfo.content){
                addPost(postInfo.title,postInfo.content,params.user,params.userID);
                //Reset input values when submission is done
                setPostInfo({title:"",content:""});
                const postInput=$("#new-post");
                $('html,body').animate({scrollTop: postInput.offset().top});
        }
        else{
            //At first setting both flag to true
            setTitleMissing(true);
            setContentMissing(true);
        }
        //Change flag to false for whichever of the two input has value
        if(postInfo.title){
            setTitleMissing(false);
            }
            if(postInfo.content){
            setContentMissing(false);
        }
        event.preventDefault();
    }

    $(".post-input-div").css("max-width",window.innerWidth+"px");

    return <div id="new-post" className="post-input-div rounded">
    {/*Viewing warning message if title or content are missing*/}
        <div className={titleMissing||contentMissing?"alert alert-danger":null} role="alert">
            {titleMissing&&"Title is missing! "}
            {contentMissing&&"Content is missing!"}
        </div>
        {/*Form to get post info*/}
        <form onSubmit={submitHandler} encType="text/plain">
            <div className="form-group">
                <input type="text" className="post-in-element" onChange={changeHandler} placeholder="title" autoComplete="off" name="title" value={postInfo.title}></input>
            </div>
            <div className="form-group">
                <textarea onChange={changeHandler} className="post-in-element" wrap="hard" rows="6" name="content" value={postInfo.content} />
            </div>
            <button type="submit" className="post-btn post-in-button btn btn-primary">Post</button>
        </form>
    </div>
}

export default NewPostInput;