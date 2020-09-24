import React, { useEffect } from "react";
import {useHistory} from "react-router-dom";

//If client requested profile/user or settings/user without specifing username
function NoUser(){
    const history=useHistory();
    useEffect(()=>{
        alert("You reach a page that is unavailable");
        history.push("/");
    })
    return <div></div>;
}

export default NoUser;