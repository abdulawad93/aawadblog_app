//Import react and react hooks
import React, { useState, useEffect } from "react";
import {useHistory} from "react-router-dom";

//Importing bcryptjs to generate salt and hash
import bcrypt from "bcryptjs";

//Importing authentication services
import {register,getCurrentUser} from "../services/auth.service.js";

//Importing validation services
import {validatePassword,checkUsernameAvailability, checkEmailAvailability, isEmailValid} from "../services/auth.validation.js";

import Navbar from "../components/navigationBar.jsx";
import Greeting from "../components/welcomeMsg";

import _ from "lodash";





function Register(){
    //Storing current user information from local storage
    const [currentUser,setCurrentUser]=useState(getCurrentUser());
    //Storing text input values
    const [newUserInfo, setNewUserInfo]=useState({username:"",password:"",email:""});
    //Storing the state of username and email availabilities
    const [usernameAvailability, setUsernameAvailbility]=useState(true);
    const [emailAvailability, setEmailAvailbility]=useState(true);
    const [emailValidity,setEmailValidity]=useState(true);

    //Storing password validation states
    const [passwordLengthFlag,setPasswordLengthFlag]=useState(false);
    const [numberCharacterFlag,setNumberCharacterFlag]=useState(false);
    const [lowerCaseFlag,setLowerCaseFlag]=useState(false);
    const [upperCaseFlag,setUpperCaseFlag]=useState(false);
    const [specialCharacterFlag,setSpecialCharacterFlag]=useState(false);
    const [unacceptedCharacterFlag,setUnacceptedCharacterFlag]=useState(false);
    //Tooltip text message displayed based on the password text input
    const [tooltipText,setTooltipText]=useState("");

    //Setting up history to redirect user to other pages
    let history=useHistory();

    //If user information is found in the local storage, redirect to feed page
    if(currentUser)
    {
        history.push("/feed");
    }


    //Fires everytime client change the username, password, or email values
    const changeHandler= (event) => {
        const {name,value}=event.target;

        //Reseting username, password, and email stored values with either the previous value or new value entered by the user
        setNewUserInfo(prevValue=>{return name==="username"?{username:value,password:prevValue.password,email:prevValue.email}
        :name==="password"?{username:prevValue.username,password:value,email:prevValue.email}
        :name==="email"&&{username:prevValue.username,password:prevValue.password,email:value};
        });
    }

    //Rendering the password requirments once since the password hint does not appear in mobile
    useEffect(()=>{
        alert("Make sure to meet the password requirements:\n"
            +"- length higher than 10 characters\n"
            +"- at least one number\n"
            +"- at least one lowercase letter\n"
            +"- at least one uppercase letter\n"
            +"- at least one special character\n"
            +"- some special character including spaces are not accepted!");
    },[]);


    //Rerendered everytime user info or password status flags are triggered. To check username and email avail and maintain async
    useEffect(()=>{
        //Calling username and email availability check funcs by sending the stored user inputs and userState set function
        checkUsernameAvailability(_.replace(_.toLower(newUserInfo.username)," ",""),setUsernameAvailbility);
        checkEmailAvailability(_.toLower(newUserInfo.email),setEmailAvailbility);
        //Sending the stored password of user input along with functions to set the status of password rules
        validatePassword(newUserInfo.password,setPasswordLengthFlag,setLowerCaseFlag,setUpperCaseFlag,setSpecialCharacterFlag,setNumberCharacterFlag,setUnacceptedCharacterFlag);
        //Reseting tooltip text depending on if the password requirement were met.
        setTooltipText(()=>(!passwordLengthFlag?"Password must include 10 characters or more.\n":"")+
        (!numberCharacterFlag?"Password must include, at least, one number.\n":"")+
        (!lowerCaseFlag?"Password must include, at least, one lowercase letter.\n":"")+
        (!upperCaseFlag?"Password must include, at least, one uppercase letter.\n":"")+
        (!specialCharacterFlag?"Password must includ, at least, one special character.":""));
        //Checking email validity
        newUserInfo.email!==""?isEmailValid(_.toLower(newUserInfo.email),setEmailValidity):setEmailValidity(true);
    },[newUserInfo,passwordLengthFlag,numberCharacterFlag,lowerCaseFlag,upperCaseFlag,specialCharacterFlag,tooltipText]);

    //Fire when form is submitted
    function registerNewUser(event){
        //If all password requirment are fell, proceed
        if(passwordLengthFlag&&numberCharacterFlag&&lowerCaseFlag&&upperCaseFlag&&specialCharacterFlag&&!unacceptedCharacterFlag)
        {
        //If username and email are available proceed
        if(usernameAvailability&&emailAvailability){
        if(emailValidity){
        /*The steps below are to ensure the password is already save and hashed before the password leaves the system.
        This will ensura that the password is not going in plain text in case no SSL is set*/
        //Gen new salt to be able to generate a hash passed on the password information stored
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(newUserInfo.password,salt, (err,hash)=>{
                //Register new user. The register function will also called getSaltAndLogin function inside the authentication file to ensure user satisfaction
                register(_.replace(_.toLower(newUserInfo.username)," ",""), newUserInfo.password,hash,salt,_.toLower(newUserInfo.email));
            })
        })
            //Delay is set to fix an issue related to async
            setTimeout(()=>history.push("/login"),1000);
        }
        else{
            console.log(isEmailValid);
            alert("Please enter a valid email!");
        }
        }
        }
        else
        {
            //Showing the password requirement if the password requirement were not met
            alert("Make sure to meet the password requirements:\n"
            +"- length higher than 10 characters\n"
            +"- at least one number\n"
            +"- at least one lowercase letter\n"
            +"- at least one uppercase letter\n"
            +"- at least one special character\n"
            +"- some special character including spaces are not accepted!");
        }
         
        //Preventing form submit default page refreshing behaviour
        event.preventDefault();
    }
    

    return <div className="register-div">
        {/*The only two available links are login and register in this case*/}
          <Navbar loginStatus={false}/>
          {/*Greeting message used accross different pages, while in each page there is a different action required*/}
          <Greeting actionRequired={"register"}/>
          <div className="container-fluid">
          <form className="register-form" onSubmit={registerNewUser}>
          {/*Each of the required field consist of label, text input, and a warning.*/}
            <div className="form-group">
            <label className="register-in-element" htmlFor="username">Username</label>
            <input id="username" className="register-in-element" onChange={changeHandler} type="text" name="username"/>
            <p className="register-in-element warning" style={usernameAvailability?{display:"none"}:null}>This username is unavailable</p>
        </div>
        <div className="form-group">
            <label className="register-in-element" htmlFor="password">Password</label>
            <input id="password" className="register-in-element" onChange={changeHandler} type="password" data-toggle="tooltip" data-placement="bottom" title={tooltipText} name="password"/>
            <p className="register-in-element warning" style={!unacceptedCharacterFlag?{display:"none"}:null}>Some special characters, including spaces, are not allowed.</p>
        </div>
        <div className="form-group">
            <label className="register-in-element" htmlFor="email">Email</label>
            <input id="email" className="register-in-element" onChange={changeHandler} type="text" name="email"/>
            <p className="register-in-element warning" style={emailAvailability?{display:"none"}:null}>This email is unavailable</p>
            <p className="register-in-element warning" style={emailValidity?{display:"none"}:null}>This email is not valid</p>
        </div>
        <button className="register-in-element btn btn-outline-dark" type="submit"><i className="fas fa-user-plus"></i> Register</button>
        </form>
        </div>
    </div>
}

export default Register;