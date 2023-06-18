require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

const app = express();

// app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
      .then((foundUser) => {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });

    newUser
      .save()
      .then((success) => {
        res.render("secrets");
        console.log("saved succesfully");
      })
      .catch((err) => {
        console.log(err);
      });
  });

// app.get("/secrets", (req, res) => {
//     res.render("secrets");
//   });

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
