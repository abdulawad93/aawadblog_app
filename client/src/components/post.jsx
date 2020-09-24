//Importing React and React Hooks
import React, { useState, useEffect } from "react";

//Importing Authentication services
import {getUserExtInfo, getUserProfileImage} from "../services/auth.service";

//Importing content management services
import { editPost, removePost, likePost, unlikePost } from "../services/contentManagement";

//Importing custom components
import CommentSection from "./commentSection.jsx";
import ProfileImage from "./profileImage.jsx";

//Importing default gender profile images
import maleDefault from "../images/profile.image.default/male.png";
import femaleDefault from "../images/profile.image.default/female.png";
import notSpecifiedDefault from "../images/profile.image.default/notSpecified.png";

function Post(props) {

    //Can edit check wether the current user id in the localstorage equal to the user ID associated with the post publisher.
    const canEdit=props.currentUserID===props.associatedUserId;

    //Edit Enabled trigger when user hits edit or save. False displays Edit; True displays Save
    const [editEnabled,setEditEnabled]=useState(false);
    //Storing post content and title in the states. That would allow users to view the previous post version while editing
    const [editedInfo,setEditedInfo]=useState({title:"",content:""});

    /*Set number of comment is passed to the comment section to get the length of comments array. 
    This would give user a preview of the number of comment before hitting the comments button to view them*/
    const [numberOfComments, setNumberOfComments]=useState(0);

    //Comment Visibility toggle the comment section on and off
    const [commentVisibility, setCommentVisibility]=useState(false);

    //Check if user already likes the post or not. False means user didn't like, and thumbup icon will appear. True, the opposite
    const [likeStatus,setLikeStatus]=useState(false);

    //Storing external info of the post publisher
    const [displayName,setDisplayName]=useState("");
    const [gender,setGender]=useState("");
    const [image,setImage]=useState();
    const [imgName,setImgName]=useState("");
    const [imageFlag,setImageFlag]=useState(false);


    //Getting user external info
    useEffect(()=>{
        if(!displayName||!image||!imgName||!gender||!props.content)
        {
        getUserExtInfo(props.associatedUserId,setDisplayName,"",setGender);
        getUserProfileImage(props.associatedUserId,setImage,setImgName,setImageFlag);
        }
    },[displayName,image,imgName,imageFlag,gender,props.content]);

    //If no image was set using getUserProfileImage service. Set profile image based on gender
    useEffect(()=>{
        if(!imageFlag)
        {
            if(gender){
                gender==="Male"?setImage(maleDefault):gender==="Female"?setImage(femaleDefault):setImage(notSpecifiedDefault);
            }
            else{
                setImage(notSpecifiedDefault);
            }
        }
    },[gender,imageFlag]);



    //Fires when title or content input values change
    function changeHandler(event) {
        const {name,value}=event.target;
        setEditedInfo(prevValue=>{
            return name==="title"?{title:value,content:prevValue.content}:
                   name==="content"&&{title:prevValue.title,content:value}
        });
    }

    //If edit enabled http update request will be intiated with title and content values
    function handleLinkClicks() {
        if(editEnabled){
            editPost(props.postID,editedInfo.title,editedInfo.content);
        }
        //Else fill post info in form
        else{
            setEditedInfo(()=>{return{title:props.title,content:props.content}});
        }
        //Switching between edit view and post view
        setEditEnabled(!editEnabled);
    }
    
    //Removing a post
    function handleRemove() 
    {
        setEditEnabled(false);
        removePost(props.postID);
    }

    //Changing comment section visibility
    function handleCommentLink() {
        setCommentVisibility(!commentVisibility);
    }

    //Checking whether the current user in the local storage liked the post or not by comparing with the post's likers array
    useEffect(()=>{
          setLikeStatus(()=>{
              return (props.postLikerIDs.find(postLikerID=>{return postLikerID===props.currentUserID}))?true:false;
          });
    },[setLikeStatus,props.postLikerIDs,props.currentUserID]);


    //Depending on like status, like or unlike http requests
    function handleLikeLink() {
        if(!likeStatus){
            likePost(props.postID,props.currentUserID);
        }
        else if(likeStatus) {
            unlikePost(props.postID,props.currentUserID);
        }
    }

    //Controlling whether post or form should be displayed based on editEnabled flag
    const postedTextStyle={
        display:editEnabled?"none":"block"
    };
    const editedTextStyle={
        backgroundColor:"#ffffff",
        display:!editEnabled?"none":"block",width:"100%"
    }

    //Inline defining of user control button style that include edit and delete
    const userControl={
        color:"#ffffff",
        marginLeft: "5px",
        marginBottom: "10px",
        //Can edit is defined wether the current user in the local storage is the publisher. If not delete and edit buttos woud be hidden
        display:!canEdit&&"none"
    }

    //Inline defining of public button style
    const actionButton={
        color:"#ffffff",
        marginLeft: "5px",
        marginBottom: "10px"
    }

    //Controlling whether save icon or edit icon should appear based on editEnabled flag
    const linkValue=editEnabled?<span><i className="fas fa-save"></i></span>
                    :<span><i className="fas fa-edit"></i></span>;






    return<div id={"post-"+props.postID}>
    {/* Linking profile image to the publisher's profile */}
    <a href={"/profile/user/"+props.publisher}>
    <ProfileImage imgSrc={image} imgAlt={imgName} parentClass="post-profile-image" />
    </a>
    <div className="post-div rounded">
    <div className="row">
    <div className="col">
            {/* Linking display name/username to the publisher's profile */}
            <a href={"/profile/user/"+props.publisher}>
            <h6 style={{marginLeft:"5px"}}>{displayName?displayName:props.publisher}</h6>
            </a>
            </div>
            <div className="col">
                {/* Viewing the date when the post was created */}
                <h6 style={{textAlign:"right", marginRight:"10px"}}>{new Date(props.date).toLocaleDateString()}</h6>
            </div>
            </div>
            {/* Post Body */}
            <h3 onChange={changeHandler} className="post-title" style={postedTextStyle} name="title">{props.title}</h3>
            <p onChange={changeHandler} className="post-content" style={postedTextStyle} name="content">{props.content.split("\n").map((sentence,index)=><span key={index}>{sentence}<br/></span>)}</p>
            {/* Form Body */}
            <input type="text" onChange={changeHandler} style={editedTextStyle} name="title" className="post-title"  value={editedInfo.title}/>
            <textarea onChange={changeHandler} wrap="hard" style={editedTextStyle} name="content" className="post-content edited-post-content" value={editedInfo.content}/>
            {/* Edit Button */}
            <a onClick={handleLinkClicks} className="btn btn-primary" style={userControl}>{linkValue}</a>
            {/* Remove Button */}
            <a onClick={handleRemove} href="#new-post" className="btn btn-danger" style={userControl}><i className="fas fa-trash-alt"></i></a>
            {/* Comment Button */}
            <a onClick={handleCommentLink} id={"post-"+props.postID} className="btn btn-outline-primary" style={actionButton}><i className="fas fa-comments"></i> {numberOfComments>0&&numberOfComments}</a>
            {/* Like Button */}
            <a onClick={handleLikeLink} className={!likeStatus?"btn btn-outline-success":"btn btn-outline-danger"} style={actionButton}>{props.postLikerIDs.length>0?props.postLikerIDs.length+" ":null}<i className={!likeStatus?"fas fa-thumbs-up":"fas fa-thumbs-down"}></i></a>
            </div>
            <CommentSection setNumberOfComments={setNumberOfComments} displayMode={commentVisibility} currentUserID={props.currentUserID} user={props.user} postID={props.postID}/>
            </div>

}

export default Post;