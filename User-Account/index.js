const express=require("express");
const app=express();
const port=8000;
const bodyParser=require("body-parser");
const path=require("path");
const db=require("./config/mongoose");
const nodemailer = require('nodemailer');


app.use(express.static("assets"));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',require("./routes/users"));
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.urlencoded({extended:false}));
// app.set("views",path.join(__dirname,"views"));
const {find}=require("./models/User");
const User=require("./models/User");

// app.get("/",function(req,res){
//     res.sendFile(__dirname+"/signup.html");
// });

app.listen(port,function(err){
    if(err){
        console.log("err");
    }
    else{
        console.log("success");
    }
});