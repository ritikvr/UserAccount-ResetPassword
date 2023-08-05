const express = require("express");
const router = express.Router();
const userscontroller = require("../controllers/users_controller");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hjdsfffffffffffffffffffffffsdkjhyfikudshfk";
const nodemailer = require("nodemailer");
const { getUser } = require("../config/auth");

router.post("/signup", userscontroller.signup);

router.get("/signin", userscontroller.signin);

router.get("/forgot", userscontroller.forgotEmail);

router.get("/", userscontroller.home);

router.post("/authenticate",userscontroller.authenticate);

router.get("/pleasecheck", userscontroller.checkEmail);


// Reset password controllers
router.post("/emaillink", function (req, res) {
  User.find().then((items) => {
    items.forEach((item) => {
      if (item.email === req.body.email) {
        const secret = JWT_SECRET + item.password;
        const token = jwt.sign({ email: item.email, id: item._id }, secret, {
          expiresIn: "10m",
        });

        const link = `http://localhost:8000/reset-password/${item._id}/${token}`;
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ashishkaushik146@gmail.com",
            pass: "lhcsqmfpkxvehgyg",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        var mailOptions = {
          from: "ashishkaushik146@gmail.com",
          to: item.email,
          subject: "password reset",
          text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        console.log(link);
        res.send("please check your Email");
      }
    });
  });
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const item = await User.findOne({ _id: id });
  if (!item) {
    return res.json({ status: "user not exist" });
  }
  const secret = JWT_SECRET + item.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("newpassword", { email: verify.email });
  } catch (err) {
    console.log(err);
    res.render("Not verified");
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const item = await User.findOne({ _id: id });
  if (!item) {
    return res.json({ status: "user not exist" });
  }
  const secret = JWT_SECRET + item.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    res.json({ status: "password updated" });
  } catch (err) {
    console.log(err);
    res.render("something went wrong");
  }
});

module.exports = router;
