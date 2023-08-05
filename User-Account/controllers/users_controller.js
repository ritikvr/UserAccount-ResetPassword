const { json } = require("express");
const { setUser } = require("../config/auth");
const User = require("../models/User");
const { checkout } = require("../routes/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hjdsffffffffsdkjhyfikudshfk";

// sign up controller
module.exports.signup = function (req, res) {
  const password = req.body.password;
  hashPassword();
  function hashPassword() {
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({
          email: req.body.email,
          password: hash,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return res.render("signin");
};
// sign in controller
module.exports.signin = function (req, res) {
  return res.render("signin");
};

module.exports.authenticate = function (req, res) {
  const EnteredEmail = req.body.email;
  const EnteredPassword = req.body.password;
  User.findOne({email:EnteredEmail}).then((user)=>{
    comparePassword(EnteredPassword,user.password);
    function comparePassword(plaintextPassword, hash) {
      bcrypt.compare(plaintextPassword, hash)
          .then((result) => {
            if(result === true) {
              const token = setUser(json.toString(user));
              res.cookie("hdhs", token);
              return res.send("logged in successfully");
            }
            else
              return res.send("wrong credentials");
          })
          .catch(err => {
              console.log(err);
          })
   }
  })
};

// home controller
module.exports.home = function (req, res) {
  return res.render("signup");
};

// forgot controller
module.exports.forgotEmail = function (req, res) {
  return res.render("forgot");
};

module.exports.checkEmail = function (req, res) {
  return res.render("check");
};
