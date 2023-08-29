//jshint esversion:
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));

main().catch(err=>console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
  console.log("Connected to mongoDB");
};

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const user1 = new User({
    email: req.body.username,
    password: req.body.password
  });
  user1.save().then(function(){
    res.render("secrets");
  }).catch(function(err){
    console.log(err);
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}).then(function(foundUser){
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    }
  }).catch(function(err){
    console.log(err);
  });
});
















app.listen(3000, function(){
  console.log("Server is up and running on port 3000");
});
