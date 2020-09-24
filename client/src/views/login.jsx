//Importing react library and states
import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

//Importing login service
import {checkSaltAndLogin, getCurrentUser} from "../services/auth.service";

//Importing custom react components
import Navbar from "../components/navigationBar.jsx";
import Greeting from "../components/welcomeMsg.jsx";

import _ from "lodash";

function Login(params){

    //Defining history to redirect user
    const history=useHistory();


    //Defining states
    //Getting current user info in the local storage if found
    const [currentUser, setCurrentUser]=useState(getCurrentUser());
    //Login Info store data of username and password entered by the users
    const [loginInfo, setLoginInfo]=useState({username:"",password:""});
    //Username warning will set to true in case username is not found.
    const [usernameWarning, setUsernameWarning]=useState(false);
    //Password warning will set to true in case password is not matching the stored password for the user
    const [passwordWarning, setPasswordWarning]=useState(false);
    //This value will set to true if username and password are matching
    const [successfulLoginFlag, setSuccessfulLoginFlag]=useState(false);


    const [token,setToken]=useState("");

    //This function will fire every time username or password textfield values are changed
    function changeHandler(event) {
        const {name,value}=event.target;
        //prevValue contains previously stored value of the specific object field
        setLoginInfo(prevValue=>{
            return name==="username"?{username:value,password:prevValue.password}
            :name==="password"&&{username:prevValue.username,password:value}
        })
    }


    useEffect(()=>{
    //If users have been found in the local storage they get redirected to the feed page instantly
    if(currentUser)
    {
        history.push("/feed");
    }
    },[history]);


    /*Handling form submit. 
      First username and password warning gets reseted in case they were switched to true in previous login attempt
      checkSaltAndLogin function will get login salt to be hashed in the client side only if a username is found in the database
      If user is not found username warning will set to true.
      If salt is found the password will get hashed in react frontend, and if the password appear to be not matching in the backend,
      password warning will set to true
      If all went fine both username warning and password warning will be set to false. And login status will set to true
      */
    function loginUser(event){
        setUsernameWarning(false);
        setPasswordWarning(false);
        checkSaltAndLogin(_.replace(_.toLower(loginInfo.username)," ",""),loginInfo.password, setSuccessfulLoginFlag,setUsernameWarning,setPasswordWarning);
        //Delay of 200ms is set to fix a bug related to async. The delay is unnoticable in this case
        if(successfulLoginFlag)
            setTimeout(()=>history.push("/feed"),200);

        //Preventing refreshing effect form submission
        event.preventDefault();
    }


    return <div className="login-div">
        {/*If the users have not been redirected to the feed page that indicated that they are not logged in.
        The only two available links are login and register in this case*/}
        <Navbar loginStatus={false}/>
        {/*Greeting message used accross different pages, while in each page there is a different action required*/}
        <Greeting actionRequired={"login"}/>
        <div className="container-fluid">
        {/*Form accept username and password values entered by the users. Each of the username and password Bootstrap form-group
         consists of label text input and warning paragraph
         The warning paragraph get displayed in username or password warnings are set to true */}
        <form className="login-form" onSubmit={loginUser}>

        <div className="form-group">
            <label className="login-in-element" htmlFor="username">Username</label>
            <input className="login-in-element" onChange={changeHandler} type="text" name="username" placeholder="username/email"/>
            <p className="login-in-element warning" style={usernameWarning?{display:"block"}:{display:"none"}}>Username or email not found</p>
            </div>

        <div className="form-group">
            <label className="login-in-element" htmlFor="password">Password</label>
            <input className="login-in-element" onChange={changeHandler} type="password" name="password"/>
            <p className="login-in-element warning" style={passwordWarning?{display:"block"}:{display:"none"}}>Password not matching</p>
            </div>

        <button className="login-in-element btn btn-outline-dark" type="submit"><i className="fas fa-sign-in-alt"></i> Login</button>
        </form>
        </div>
    </div>
}

export default Login;