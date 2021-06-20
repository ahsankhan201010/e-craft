const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

const signJWT = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.fetchUsers = async (req, res) => {
  //admin
  try {
    var users = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    //encryption
    var user = await User.create(req.body); //bson
    var { password, ...modifiedUser } = user.toObject(); //simple object
    //generate JWT
    var token = signJWT(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: modifiedUser,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    var { email, password } = req.body;
    //check if user & email exits
    if (!email || !password) {
      return res.status(404).json({
        status: "error",
        error: "please enter email & password",
      });
    }
    //fetch user whose email is given
    var user = await User.findOne({ email }).select("+password"); 
    //verify password
    //enceptyed ps === password
    var passwordVerified = await user.passwordVerification(password, user.password) 
    if (!passwordVerified || !user) {
      return res.status(401).json({
        status: "error",
        error: "invalid email or password",
      });
    }
    //generate token
    var token = signJWT(user._id);
    //send response
    var { password, ...modifiedUser } = user.toObject();
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: modifiedUser,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
