import bcrypt from "bcryptjs";
import axios from "axios";
import qs from "querystring";

const API_URL = "/auth/";

const URLEncodedHeader={"Content-Type":"application/x-www-form-urlencoded"};



//Register Process
const register = (username, password, hash, salt, email) => {
  axios.post(API_URL + "create-user", qs.stringify({
    username:username, hash:hash, salt:salt, email:email
  }),URLEncodedHeader).then(()=>  checkSaltAndLogin(username,password)).catch(err=>{console.log(err);});
};

//Intiating Login Process by getting the salt value for password hashing from the frontend
const checkSaltAndLogin= (username,password,setSuccessfulLoginFlag, setUsernameWarning,setPasswordWarning)=>{
  const url=API_URL+"get-salt";
  axios.post(url,qs.stringify({username:username}),URLEncodedHeader)
  .then(response=>{
      if(response.data.salt){
      bcrypt.hash(password,response.data.salt, (err,hash)=>{
          if(err){
              console.log(err);
            ;
          }
          else{
               login(username,hash,setPasswordWarning).then((loginStatus)=>{
                   if(loginStatus)
                   {
                     if(setSuccessfulLoginFlag)
                    setSuccessfulLoginFlag(true);
                   }
                   else
                   {
                       if(setPasswordWarning)
                       setPasswordWarning(true);
                   }
               });
              }
           })}
           else{
               if(setUsernameWarning)
               setUsernameWarning(true);
           }
  }).catch(err=>{console.log(err);});
}

//Loogin process
const login = (username, hash, setPasswordWarning) => {
  return axios
    .post(API_URL + "verify-user", qs.stringify({
      username:username,
      hash:hash,
    }),URLEncodedHeader)
    .then((response) => {
      if (response.data.loginFlag) {
        localStorage.setItem("aawad-blog-user", JSON.stringify(response.data));
        return true;
      }
      else{
        return false;
      }
    }).catch(err=>{console.log(err);})
};


//Logout by removing user from local storage
const logout = () => {
  localStorage.removeItem("aawad-blog-user");
};

//Getting current user information from local storage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("aawad-blog-user"));
};

//Getting user id to be used in profile and setting pages
const getUserID = (username,setUserID) => {
  const urlUserID=API_URL+"get-user-id";
        const dataUserID={username:username};
        axios.post(urlUserID,qs.stringify(dataUserID),URLEncodedHeader).then(response=>{setUserID(response.data.userID)}).catch(err=>{console.log(err);});
}

//Saving user external info
const saveUserExtInfo=(userID,displayName,aboutUser,selectedGender,selectedDay,selectedMonth,selectedYear)=>{
  const url=API_URL+"save-user-info";
  const data={userID:userID,displayName:displayName,  aboutUser:aboutUser, gender:selectedGender, birthDay:selectedDay, birthMonth:selectedMonth, birthYear:selectedYear};
  axios.patch(url,qs.stringify(data),URLEncodedHeader).then(response=>console.log(response)).catch(err=>{console.log(err);;});
}

//Saving profile image
const saveUserProfileImg=(userID,imageFormObj)=>{
  const url=API_URL+"save-profile-image/user/"+userID;
  axios.patch(url,imageFormObj).then(response=>console.log(response)).catch(err=>{console.log(err);}); 
}

//Getting user external info
const getUserExtInfo = (userID,setDisplayName,setAboutUser,setGender,setBirthDay,setBirthMonth,setBirthYear) => {
  const url=API_URL+"get-external-user-info";
        const data={userID:userID};
        axios.post(url,data,URLEncodedHeader).then(response=>{
        setDisplayName&&response.data.displayName&&setDisplayName(response.data.displayName);
        setAboutUser&&response.data.aboutUser&&setAboutUser(response.data.aboutUser);
        setGender&&response.data.gender&&setGender(response.data.gender);
        setBirthDay&&response.data.birthDay&&setBirthDay(response.data.birthDay);
        setBirthMonth&&response.data.birthMonth&&setBirthMonth(response.data.birthMonth);
        setBirthYear&&response.data.birthYear&&setBirthYear(response.data.birthYear)
        }).catch(err=>{console.log(err);});
}

//Getting user profile image and name
const getUserProfileImage = (userID,setImage,setImgName,setImageFlag) => {
  const url=API_URL+"display-profile-image";
        const data={userID:userID};
        axios.post(url,qs.stringify(data),URLEncodedHeader).then(response=>{
        console.log(response.data.imageData);
        response.data.imageData&&setImage(response.data.imageData.fileLink);
        response.data.imageData&&setImageFlag&&setImageFlag(true);
        response.data.imageName&&setImgName(response.data.imageData.description);
      }).catch(err=>{console.log(err);});
}

export {
  register,
  checkSaltAndLogin,
  login,
  logout,
  getCurrentUser,
  getUserID,
  saveUserExtInfo,
  saveUserProfileImg,
  getUserExtInfo,
  getUserProfileImage
};