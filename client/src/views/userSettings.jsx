//Importing react and react hooks
import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";

//Importing authentication services
import {getCurrentUser,getUserID,saveUserExtInfo,saveUserProfileImg,getUserExtInfo,getUserProfileImage} from "../services/auth.service";


//Importing custom components
import Navbar from "../components/navigationBar.jsx"
import Dropdown from "../components/dropdown.jsx";
import Label from "../components/label.jsx";
import ImageInput from "../components/imageInput.jsx";
import ProfileImage from "../components/profileImage.jsx";
import BootstrapTextInput from "../components/bootstrapTextInput.jsx";


//Importing default gender images
import maleDefault from "../images/profile.image.default/male.png";
import femaleDefault from "../images/profile.image.default/female.png";
import notSpecifiedDefault from "../images/profile.image.default/notSpecified.png";

import $ from "jquery";


//Material-UI
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';





function UserSettings (){



    //Defining history to redirect user
    const history=useHistory();

    //Getting the username parameter value of the url
    const {username}=useParams();

    //Intiating state to get current user id from local storage and profile user id for comparission reasons
    const [currentUserID,setCurrentUserID]=useState("");
    const [profileUserID,setProfileUserID]=useState("");

    //Intiating states to store user external info.
    const [displayName,setDisplayName]=useState("");
    const [aboutUser,setAboutUser]=useState("");
    const [selectedGender,setSelectedGender]=useState();
    const [selectedDay,setSelectedDay]=useState();
    const [selectedMonth,setSelectedMonth]=useState();
    const [selectedYear,setSelectedYear]=useState();
    const [imageSelectedFlag,setImageSelectedFlag]=useState(false);
    const [image,setImage]=useState(notSpecifiedDefault);
    const [imgName,setImgName]=useState();
    
    //Intiating FormData object to hold the image date and name to be accessed by multer package in auth.js
    const [imageFormObj,setImageFormObj]=useState(new FormData());

    //Setting initial values of gender and date to be passed as params to dropdown component
    const [genderOptions,setGenderOptions]=useState(["Male","Female","Not Specified"]);
    const [days,setDays]=useState();
    const [months,setMonths]=useState(["January","February","March","April","May","June","July","August","September","October","November","December"]);
    const [years,setYears]=useState();

    //Get current user info
    const [currentUser,setCurrentUser]=useState(getCurrentUser());

    //Check if all the previous saved information area loaded
    const [infoLoaded,setInfoLoaded]=useState(false);

    

    //Function to set the number of days according to months. It get's called from dropdown component when a month is selected
    function setDaysAccordingToMonth(selectedMonth){
        setDays([]);
        switch (selectedMonth){
            case "January": case "March": case "May": case "July": case "August": case "October": case "December": for(let i=1; i<=31; i++){
                setDays(prevValue=>[...prevValue,i]);
            } break;
            case "February": for(let i=1; i<=29; i++){
                setDays(prevValue=>[...prevValue,i]);
            } break;
            case "April": case "June": case "September": case "November": for(let i=1; i<=30; i++){
                setDays(prevValue=>[...prevValue,i]);

            } break;
            default: for(let i=1; i<=31; i++){
                setDays(prevValue=>[...prevValue,i]);

            } break;
        }
    }



    useEffect(()=>{
        //Load the years array with data from 10 years ago until 1900
        setYears([]);
        for(let i=new Date().getFullYear()-10; i>=1900; i--){
            setYears(prevValue=>[...prevValue, i]);
        }
        //Load days array initial data with 31 days
        setDays([]);
        for(let i=1; i<=31;i++){
            setDays(prevValue=>[...prevValue, i]);
        }

        //If no image was uploaded set image, based on gender, from the imported images.
    if(!imageSelectedFlag){
        if(selectedGender){
            if(selectedGender==="Male")
                setImage(maleDefault);
            else if(selectedGender==="Female")
                setImage(femaleDefault);
            else
                setImage(notSpecifiedDefault);
        }
        else{
            setImage(notSpecifiedDefault);
        }
    }
    },[selectedGender,imageSelectedFlag]);


    //If current user is available, reload user info. Else, redirect to login page.
    useEffect(()=>{
        if(currentUser){
        getUserID(username,setProfileUserID);
        setCurrentUserID(currentUser.userID);
            if(currentUserID&&profileUserID)
            if(currentUserID===profileUserID){
                //If all information are loaded skip
                if(!infoLoaded)
                {
                getUserExtInfo(currentUserID,setDisplayName,setAboutUser,setSelectedGender,setSelectedDay,setSelectedMonth,setSelectedYear);
                getUserProfileImage(currentUserID,setImage,setImgName);
                if(currentUserID&&profileUserID&&displayName&&aboutUser&&selectedGender&&selectedDay&&selectedMonth&&selectedYear)
                {
                    setInfoLoaded(true);
                }
                }
                }
                else{
                    history.push("/login");
                }
            }
        else{
            history.push("/login");
        }
    },[currentUserID,profileUserID,displayName,aboutUser,selectedGender,selectedDay,selectedMonth,selectedYear,infoLoaded]);



function clickHandler(event){
    const {name}=event.target;
    //Checking which button was clicked. The user will be redirected as described
    if(name==="submit-info-to-profile"){
    //Updating user external info
    saveUserExtInfo(profileUserID,displayName,aboutUser,selectedGender,selectedDay,selectedMonth,selectedYear);
    //Update image only if a new image file was uploaded
    if(imageFormObj&&imageSelectedFlag){
    saveUserProfileImg(currentUserID,imageFormObj);
    }
    name==="submit-info-to-profile"&&history.push("/profile/user/"+username);
}
    //If reset button was clicked, remove existing image file in form data object and update database with null image
    else if(name==="reset-picture"){
        setImageSelectedFlag(false);
        imageFormObj.delete("profileImgData");
        imageFormObj.append("profileImgData",null);
        saveUserProfileImg(currentUserID,imageFormObj);
        setImage(selectedGender==="Male"?maleDefault:selectedGender==="Female"?femaleDefault:notSpecifiedDefault);
    }  
}

return <div>
{/*Rendering navbar with logged in status to show feed, profile, settings, and logout links*/}
<Navbar loginStatus={true}/>
<div className="container-fluid">
{/*Save info and redirect to profile page*/}
<button onClick={clickHandler} className="btn btn-dark" name="submit-info-to-profile">Save Info</button>

{/*Getting display name and about user input*/}
<BootstrapTextInput requestedInfo="Display Name" setTextInfo={setDisplayName} initValue={displayName}/>
<BootstrapTextInput requestedInfo="About" setTextInfo={setAboutUser} initValue={aboutUser}/>  

{/*Getting gender input*/}
<div className="input-group mb-3">
  <Label htmlForProp="gender-option" labelText="Gender"/>
  <Dropdown id="gender-option" optionData={genderOptions} dropdownDescription="gender-selection" setSelectedValue={setSelectedGender} initValue={selectedGender}/>
</div>

{/*Getting birthdate input*/}
  <div className="row">
  <div className="col-md-4 col-sm-12">
  <div className="input-group mb-3">
  <Label htmlForProp="birth-day" labelText="Birth Day"/>
  <Dropdown id="birth-day" optionData={days} dropdownDescription="birth-day" setSelectedValue={setSelectedDay} initValue={selectedDay}/>
  </div>
  </div>
  <div className="col-md-4 col-sm-12">
  <div className="input-group mb-3">
  <Label htmlForProp="birth-month" labelText={"Birth Month"}/>
  <Dropdown id="birth-month" optionData={months} setDaysAccordingToMonth={setDaysAccordingToMonth} dropdownDescription="birth-month" setSelectedValue={setSelectedMonth} initValue={selectedMonth}/>
  </div>
  </div>
  <div className="col-md-4 col-sm-12">
  <div className="input-group mb-3">
  <Label htmlForProp="birth-year" labelText={"Birth Year"}/>
  <Dropdown in="birth-year" optionData={years} DropdownDescription="birth-year" setSelectedValue={setSelectedYear} initValue={selectedYear}/>
  </div>
  </div>
  </div>

    {/*Getting images input*/}
    <ImageInput imgUse="Profile Picture" setImage={setImage} setImageSelectedFlag={setImageSelectedFlag} setImageFormObj={setImageFormObj} username={username}/>

    {/*Image preview*/}
    <ProfileImage parentClass="settings-profile-image" imgSrc={image} imgAlt={imgName?imgName:"uploaded-profile-image"}/>
    {/*Clearing Image State*/}
    <button onClick={clickHandler} className="btn btn-danger settings-button" name="reset-picture">Clear Image</button>
</div>
</div>;
}

export default UserSettings;