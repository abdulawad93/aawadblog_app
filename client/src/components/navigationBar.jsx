import React, { useState, useEffect } from "react";
import {getCurrentUser} from "../services/auth.service";


function Navbar(props){

//Getting the loginStatus to determine which links will appear to the user
const loginStatus= props.loginStatus;

//Storing current username to use it as a parameter in the profile/user and settings/user URL
const [currentUsername,setCurrentUsername]=useState("");

    const currentUser=getCurrentUser();
    useEffect(()=>{
        if(currentUser)
        {
            setCurrentUsername(currentUser.username);
        }
    },[currentUser])
    
    

    return <div>
    {/*Bootstrap Navigation Bar*/}
         <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-margin">
            <a className="navbar-brand" href="/">AAWAD Blog</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className="nav-link active" href="/feed" style={loginStatus?{display:"block"}:{display:"none"}}>Main Feed<span className="sr-only">(current)</span></a>
                    <a className="nav-link active" href={"/profile/user/"+currentUsername} style={loginStatus?{display:"block"}:{display:"none"}}>Profile</a>
                    <a className="nav-link" href={"/settings/user/"+currentUsername} style={loginStatus?{display:"block"}:{display:"none"}}>Settings</a>
                    <a className="nav-link active" href="/login" style={!loginStatus?{display:"block"}:{display:"none"}}>Login</a>
                    <a className="nav-link" href="/register" style={!loginStatus?{display:"block"}:{display:"none"}}>Register</a>
                    <a className="nav-link" href="/logout" style={loginStatus?{display:"block"}:{display:"none"}}>Logout</a>
               </div>
            </div>
          </nav>
    </div>
}

export default Navbar;