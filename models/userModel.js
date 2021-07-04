const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "user name is required!"],
  },
  role: {
    type: String,
    required: [true, "role is required!"],
    enum: ["artist", "buyer"],
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
    select: false, //security
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
});

//model instance method -> this method will be available for all the documents created by this model
userSchema.methods.passwordVerification = async (password, hasedPassword) => {
  return await bcrypt.compare(password, hasedPassword);
};

//password reset token generator
userSchema.methods.passwordResetTokenGenerator = function () {
  //this -> user document
  //generate random string of 32 bits
  var resetToken = crypto.randomBytes(32).toString("hex");
  //encrypt reset token
  var encryptedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //save encrypted resettoken in user document
  this.passwordResetToken = encryptedResetToken;
  //set token expiry (10 min)
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  //return non-encrypted reset token
  return resetToken;
};

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
