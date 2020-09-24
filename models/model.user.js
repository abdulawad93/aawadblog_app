const mongoose=require("mongoose");


//defining userschema. Most of the validation process have been done in reactjs frontend
const userSchema=new mongoose.Schema({
  username:
  {
      type: String,
      min:1,
      required: true,
      unique: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  serverHash: {
    type: String,
    required: true
  },
  serverSalt: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String
  },
  aboutUser: {
    type: String
  },
  profileImgData: {
    type: Object
  },
  gender: {
    type: String
  },
  birthDay: {
    type: String
  },
  birthMonth: {
    type: String
  },
  birthYear: {
    type: String
  },
  dateAdded: {
    type: Date
  }
});

const User=mongoose.model("User",userSchema);

module.exports={User,userSchema};
