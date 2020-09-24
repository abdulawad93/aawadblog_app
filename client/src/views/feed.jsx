//Requiring React and React Hooks
import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";

import axios from "axios";

//Requiring react components
import Navbar from "../components/navigationBar.jsx";
import NewPostInput from "../components/newPostInput.jsx";
import Post from "../components/post.jsx";

//Requiring service for authentication and validation
import {getCurrentUser, logout} from "../services/auth.service.js";

import {getPosts} from "../services/contentManagement.js";

function Feed() {
    require('dotenv').config();
    //Requring history to redirect users to other urls
    const history=useHistory();

    //Defining state hooks
    //userConnected hook created to referesh with the login status and to avoid a bug
    const [currentUser,setCurrentUser]=useState(getCurrentUser());

    //posts array stores all post information
    const [posts,setPosts]=useState([]);

    //Storing username and ID to be used in creating posts and comments with associated ids and username
    const [username,setUsername]=useState("");
    const [userID,setUserID]=useState("");

    //Storing current time and date to compare with expiration time and date of the session
    const [currentDate,setCurrentDate]=useState(new Date().valueOf());



    /*Checking wether a user is found in the local storage. 
     If the user is not found in the local storage, redirect to login page
     If not, but the 24-hour session has ended, automatically logout. Then, redirect to login page.
     If the user is found and the session isn't expired save username and user id in the associated states.*/
     
    useEffect(()=>{
        if(!currentUser||currentUser.expires<=currentDate)
        {
            alert("Please login first!\nPlease know that your password is protected use hashing and salting algorithms\nIn case you don't want to create an account but still interested in viewing the content please use the cardenantials below:\nUsername: testing\nPassword: 1234ABcd$$");
            history.push("/login");
        }
        else if(currentUser){
        if (currentUser.expires<=currentDate)
            {
            alert("Your 24-hour session has been expired for security reasons. Please login again!");
            logout();
            history.push("/login");
            }
        else
        {
            setUsername(currentUser.username);
            setUserID(currentUser.userID);
        }
    }
    },[username,userID]);


    //Rerendering posts over and over to add live views of the posts and associated likes
    useEffect(()=>{

        /*Setting currentDate every time the posts are rerendered and comparing the date with the expiratation date and time.
         Then, logging out and displaying session expiration message if the time exceeded the expiration time*/
         setCurrentDate(new Date().valueOf());
         if(currentUser){
         if(currentUser.expires<=currentDate)
         {
 
             alert("Your 24-hour session has been expired for security reasons. Please login again!");
             logout();
             history.push("/login");
         }
     }


        //Getting posts
        const source = axios.CancelToken.source();
        getPosts(setPosts,source);
        return (() => {
            source.cancel();
        });
    }, [posts]);


    return <div>
        {/*Rendering navbar with logged in status to show feed, profile, settings, and logout links*/}
        <Navbar loginStatus={true}/>
        {/*Bootstrap container-fluid will help in keeping the page view stable accross multiple devices and will keep the html content
        centered beautifuly*/}
        <div className="container-fluid">
        {/*Bootstrap jumbotron to welcome users*/}
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">AAWAD Blog</h1>
                <p className="lead">Welcome {username}, Feel free to leave any thoughts and ideas you would like to share.</p>
            </div>
        </div>
        <div className="container-fluid">
        {/*Using new post input to give the user an interface to compose their posts with title and content*/}
            <NewPostInput user={username} userID={userID}/>
        {/*Using react map function to go through every post and fill each post information in the Post components*/}
            {posts.map((post,id)=>{
                //Post component passing parameter including post content,title,publisher "user", associated userid
                return <Post key={id} postID={post._id} 
                associatedUserId={post.userID} title={post.title} content={post.content} 
                date={post.dateAdded} publisher={post.publisher} currentUserID={userID} 
                user={username} postLikerIDs={post.likers}/>
                })}
                </div>
                </div>
        </div>
}

export default Feed;