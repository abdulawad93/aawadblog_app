//Importing react library
import React from "react";

//Importing custom react components
import Navbar from "../components/navigationBar.jsx";
import Greeting from "../components/welcomeMsg";

function Home(params){

    return <div>
        {/*Navbar assumes the the user is logged in, while not necessarly logged in. It will give access to feed, profile, and setting*/}
        <Navbar loginStatus={true}/>
        <div className="container-fluid">
        {/*Greeting message used accross different pages, while in each page there is a different action required*/}
        <Greeting actionRequired={"login or register"}/>
        {/*Bootrap button to login and register The button is linked with anchor tag instead of using clickHandlers and history to redirect*/}
        <div className="log-in-out-btns">
         <button className="btn btn-primary"><a href="/login">Login</a></button>
         <button className="btn btn-primary"><a href="/register">Register</a></button>
        </div>
        </div>
    </div>
}

export default Home;