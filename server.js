//Allowing the use of environmental variables to keep keys and URIs
require('dotenv').config();

//Requiring npm packages
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const path=require("path");

//Defining app
const app=express();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

//Allowing cross origin requests "used for development"
var cors = require('cors');
app.use(cors({origin: true, credentials: true}));

//Connecting to mongoDB URI located in the environment variables ".env" file. The URI is obtained from the project's clutter in mongoDB cloud hosting
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false, useCreateIndex:true});

//Requiring api and auth routes
const api=require(__dirname+"/routes/api.js");
const auth=require(__dirname+"/routes/auth.js");

//Middleware
app.use("/api",api);
app.use("/auth",auth);



//Connecting server with client
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/"));
});

//Conneting to server on port 5000 for development or process.env.post to be hosted on heroku cloud
app.listen(process.env.PORT,()=>console.log("Started connection on port "+process.env.PORT));
