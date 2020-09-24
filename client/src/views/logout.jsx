//Importing react and react hooks
import React, { useState } from "react";
import {useHistory} from "react-router-dom";

//Importing authentication services
import {logout,getCurrentUser} from "../services/auth.service.js";

//Import customer components
import Navbar from "../components/navigationBar.jsx";

function Logout(){
    //Defining history hook to redirect users to other page
    const history=useHistory();

    //Getting current user information, mainly, to check if user is found in the local storage
    const [currentUser,setCurrentUser]=useState(getCurrentUser());

    //The check below is to avoid possible error from the logout function if not user was found in the local storage
    if(currentUser){
       //Calling logout function to remove the user from the local storage
       logout();
       //Redirecting to home page after 2 seconds delay to ensure users have time to read the message in logout page
       setTimeout(()=>history.push("/"),2000);
    }
    else{
        history.push("/");
    }

    return<div>
    {/*The navigation bar is mainly here to keep a consistent design between pages.
    Linking user to login and register pages does not effect the logout process*/}
    <Navbar loginStatus={false}/>
    <div className="container-fluid">
    {/*Message to user*/}
    <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <div className="display-4">You are currently being logged out.</div>
                <div className="lead">Please visit us soon!</div>
                {/*Animation used to give an active display to users during the delay time*/}
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only" style={{margin:"0 auto"}}>Loading...</span>
                </div>
            </div>
    </div>
    </div>
    </div>
}

export default Logout;