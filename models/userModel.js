const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "user name is required!"],
  },
  email: {
    type: String,
    unique: true, //indexing
    required: true, //TODO: check email pattern //validation
    lower: true, // user@gmail.com & User@gmail.com //modification
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: [
      function (val) {
        //this -> document
        return val === this.password;
      },
      "passowrd not match ",
    ],
  },
});

userSchema.pre("save", async function (next) {
  //this -> document
  if (!this.isModified("password")) return next();
  var encryptedPassword = await bcrypt.hash(this.password, 12); //number brute force attack
  this.password = encryptedPassword;
  this.passwordConfirm = undefined;
  next();
});

var User = new mongoose.model("User", userSchema);
module.exports = User;
