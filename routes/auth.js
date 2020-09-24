
//Requiring the global .env to get the KEY value to be used in jwt encryption
require('dotenv').config();

//Requiring packages
const express=require("express");
const bodyParser=require("body-parser");
const router=express.Router();
const _=require("lodash");
const multer=require("multer");
const bcrypt = require('bcrypt');
const moment = require('moment');

const uuid = require('node-uuid');
const AWS = require('aws-sdk');



var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//Defining salt rounds to create salt to be used by bcrypt in hashing
const saltRounds=10;


//Setting up body-parser to read urlencoded values from req.body
router.use(bodyParser.urlencoded({extended:true}));


//Requiring User module
const {User}=require("../models/model.user.js");


//Getting all users info to be accessed by admin
let usersSent=[];
router.get("/get-all-users",(req,res)=>User.find().then(foundUsers=>{foundUsers.forEach(foundUser=>{usersSent.push({user:foundUser.username, email:foundUser.email})}); res.json(usersSent)}).catch(err=>{res.status(401); res.json(err);}));


//Finding user id by username
router.post("/get-user-id",(req,res)=>User.findOne({username:req.body.username}).then(foundUser=>{res.json({userID:foundUser._id})}).catch(err=>res.json(err)));

//Registering or Creating a new users in MongoDB
router.post("/create-user",(req,res)=>{
  
  //Getting the current date to indicate the date each users was created on
  const date=new Date();

  //Getting backend hash as a second layer of security
  bcrypt.genSalt(saltRounds,(err,salt)=>{
    if(err)
      console.log(err)
    else{
      bcrypt.hash(req.body.hash,salt,(err,hash)=>{
        if(err)
          console.log(err);
        else{

          //Setting data and adding new user to MongoDB
          const user=new User({
            username: req.body.username,
            hash: req.body.hash,
            serverHash: hash,
            salt: req.body.salt,
            serverSalt: salt,
            email: req.body.email,
            dateAdded: date,
          });

          user.save().then(()=>res.json("User with ID "+user._id+" is Added")).catch(err=>res.json(err));
        }
      })
  }});
});


//Update user external information
router.patch("/save-user-info",(req,res)=>{
  User.findByIdAndUpdate(req.body.userID,{$set: req.body}).then(response=>res.json("User information were updated for a user with id "+response._id)).catch(err=>res.json(err));
});

//Update Profile Phote
router.patch("/save-profile-image/user/:userID",upload.single("profileImgData"),(req,res)=>{

  //Getting file data
  const file=req.file;
  //Setting up AWS S3
  const s3FileURL = process.env.AWS_UPLOADED_FILE_URL_LINK;
  //Setting up AWS.S3 object with version and user credintial infos
  const s3bucket = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  //Defining an existing AWS Bucket, the image file details, and Access Control List Level
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read"
  };

  //uploading a new image to AWS S3
  s3bucket.upload(params, function(err, data) {
    if (err) {
      res.json(err);
    } else {
      const newFileUploaded = {
        description: req.body.profileImgName,
        fileLink: s3FileURL + file.originalname,
        s3_key: params.Key
      };
      console.log(newFileUploaded);
      User.findByIdAndUpdate(req.params.userID,{$set: {profileImgData:newFileUploaded, profileImgName:req.body.profileImgName}})
      .then(response=>{res.json(data)}).catch(err=>res.json(err));
    }
})
});

//Get External Information
router.post("/get-external-user-info",(req,res)=>{
  User.findById(req.body.userID).then(foundUser=>res.json({displayName:foundUser.displayName, aboutUser:foundUser.aboutUser,gender:foundUser.gender,birthDay:foundUser.birthDay,birthMonth:foundUser.birthMonth,birthYear:foundUser.birthYear})).catch(err=>res.json(err));
})

//Get Profile Photo
router.post("/display-profile-image",(req,res)=>{
  User.findById(req.body.userID).then(foundUser=>res.json({imageData:foundUser.profileImgData, imageName:foundUser.profileImgName})).catch(err=>res.json(err));
})

//Sending the stored salt for frondend hashing
router.post("/get-salt",(req,res)=>User.findOne({$or: [{username:req.body.username},{email:req.body.username}]}).then(foundUser=>{res.json({salt:foundUser.salt})}).catch(err=>res.json(err)));



//Verifying user cardinantials
router.post("/verify-user",(req,res)=>User.findOne({$or: [{username:req.body.username},{email:req.body.username}]}).then(foundUser=>{

  //Setting default data - The flags are to be used in the frontend to improve user experience
  const dataSent={msg: "", usernameMatch: false, passwordMatch: false, loginFlag: false, expires:"", userID:"", username:"",date:"",displayName:"",aboutUser:"",profileImgName:"",profileImgData:"",gender:"", birthDay:"", birthMonth:"", birthYear:""};
  
  //Username Match
  if(foundUser){

    //Checking frontend generated hash
    if(foundUser.hash===req.body.hash){

      //Generating backend hash for comperassion with existing hash
      bcrypt.hash(foundUser.hash,foundUser.serverSalt,(err,hash)=>{
        if(err)
          console.log(err)

        else {

        //Hash Match
        if(foundUser.serverHash===hash){

        //Massage and Status Setup
        dataSent.msg="Successfully logged in!";
        dataSent.loginFlag=true;
        dataSent.userID=foundUser._id;
        dataSent.username=foundUser.username;
        dataSent.date=foundUser.dateAdded;
        dataSent.displayName=foundUser.displayName;
        dataSent.aboutUser=foundUser.aboutUser;
        dataSent.profileImgName=foundUser.profileImgName;
        dataSent.profileImgData=foundUser.profileImgData;
        dataSent.gender=foundUser.gender;
        dataSent.birthDay=foundUser.birthDay;
        dataSent.birthMonth=foundUser.birthMonth;
        dataSent.birthYear=foundUser.birthYear;


        const expires = moment().add(24, 'hours').valueOf();

        dataSent.expires=expires;

        //Sending data in JSON format
        res.json(dataSent);
        }
      }
      })
    }
    else{
      //User matched, but password didn't match

      //Setting msg and sending data
      dataSent.msg="Password did not match!";
      res.json(dataSent);
    }
  }
  else{
    //Setting msg and sending data
      dataSent.msg="No matching username!";
    res.json(dataSent);
  }
}
).catch(err=>res.json(err)));


//Exporting the current route
module.exports=router;