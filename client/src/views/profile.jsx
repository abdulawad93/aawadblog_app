//Imporing react and react hooks
import React, { useEffect, useState } from "react";
import {useParams, useHistory} from "react-router-dom";

//Importing authentication services
import {getCurrentUser,getUserID,getUserExtInfo,getUserProfileImage} from "../services/auth.service.js";


//Importing content managment services
import {getPostsByUserID} from "../services/contentManagement.js"

//Importing components
import Navbar from "../components/navigationBar.jsx"
import NewPostInput from "../components/newPostInput.jsx";
import Post from "../components/post.jsx";
import ProfileImage from "../components/profileImage.jsx"



function Profile(){

    //Defining history to redirect user
    const history=useHistory();

    //Getting the value of the username url parameter
    const {username}=useParams();

    //Intiating currentUserID and ProfileUserID for comparission and access level reasons
    const [currentUserID,setCurrentUserID]=useState("");
    const [profileUserID,setProfileUserID]=useState("");
    const [isOwner,setIsOwner]=useState(false);

    //Intiating posts array
    const [posts,setPosts]=useState([]);

    //Intiating states to hold profile user' external info
    const [displayName,setDisplayName]=useState("");
    const [aboutUser,setAboutUser]=useState("");
    const [birthDay,setBirthDay]=useState("");
    const [birthMonth,setBirthMonth]=useState("");
    const [birthYear,setBirthYear]=useState("");
    const [gender,setGender]=useState("");
    const [image,setImage]=useState("");
    const [imgName,setImgName]=useState("");

    //Getting current user to get necessary info and to check if user is available in local storage
    const [currentUser,setCurrentUser]=useState(getCurrentUser());

    
    //Storing user info if the user is found in the local storage
    useEffect(()=>{
        if(currentUser){
        getUserExtInfo(profileUserID,setDisplayName,setAboutUser,setGender,setBirthDay,setBirthMonth,setBirthYear);
        getUserProfileImage(profileUserID,setImage,setImgName);
    }
    else{
        history.redirect("/login");
    }
    },[currentUser,currentUserID,profileUserID,history,username,displayName,aboutUser,gender,birthDay,birthMonth,birthYear,image,imgName]);

    //Comparing profile user ID and current user ID to set access level 
    useEffect(()=>{
        if(currentUser){
        getUserID(username,setProfileUserID);
        setCurrentUserID(currentUser.userID);
        if(currentUserID&&profileUserID){
        if(currentUserID===profileUserID)
        {
                setIsOwner(true);
        }
        else
        {
            setIsOwner(false);
        }
    }
    }
    },[currentUserID,profileUserID]);



    //Rerendering posts published by the profile owner
    useEffect(()=>{
        if(currentUser){
        getPostsByUserID(profileUserID,setPosts);
    }
    },[posts,currentUserID]);


    return <div>
        {/*Rendering navbar with logged in status to show feed, profile, settings, and logout links*/}
        <Navbar loginStatus={true}/>
        <div className="container-fluid">
        {/*User Settings Linked button only appear if the current user is the profile owner*/}
        {isOwner&&<a role="button" className="btn btn-secondary" style={{display:"inline"}} href={"/settings/user/"+username}>User Setting</a>}
        
        {/*In the jumbotron if display name available it gets displayed, else username gets displayed*/}
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">{displayName?displayName:username} Profile</h1>
                {aboutUser&&<p className="lead">{aboutUser}</p>}
            </div>
        </div>

        {/*Images display in the profile page only if there is an uploaded picture by the profile owner to keep consistent design and hide unnecessary details*/}
        {image&&<ProfileImage parentClass="profile-page-image" imgSrc={image} imgAlt={imgName}/>}


        {/*Post compose box only appear if the current is the profile owner*/}
        {isOwner&&<NewPostInput user={username} userID={currentUserID}/>}
        
        {/*If there are any posts shared by they get display here. Else, message appears*/}
        {posts&&posts.length>0?posts.reverse().map((post,id)=>{
                return <Post key={id} postID={post._id} associatedUserId={post.userID} title={post.title} content={post.content} date={post.dateAdded} publish={post.publisher} currentUserID={currentUserID} user={username} publisher={username} postLikerIDs={post.likers}/>
                }):
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <p className="lead">{displayName?displayName:username} didn't submit any posts yet!</p>
                </div>
            </div>
                }
                </div>
    </div>
}

export default Profile;