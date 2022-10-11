//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

console.log(process.env.SECRET);

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptionFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) {
      console.log("UH-OH! There was a problem while creating the user!");
    } else {
      res.render("secrets");
    }
  });
});
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log("Unable to find the user , please Register! " + err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      } else {
        res.render("register");
      }
    }
  });
});

app.listen(3000, function (req, res) {
  console.log("listening on the port 3000..");
});
