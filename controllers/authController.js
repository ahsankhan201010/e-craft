const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const { promisify } = require("util");

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
    var passwordVerified = await user.passwordVerification(
      password,
      user.password
    );
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

exports.protect = async (req, res, next) => {
  try {
    var token = null;
    // 1- fetch token from request header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2- check if token exits
    if (!token) {
      return res.status(401).json({
        error: "please sign in!",
      });
    }
    // 3- verify
    var { id: userId, iat: tokenIssuedAt } = await promisify(JWT.verify)(
      token,
      process.env.JWT_WEB_SECRET
    ); //converting callback function to async await method (promise)
    // 4- check if user exist in DB
    var user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        error: "user belonging to this token does not exist!",
      });
    }
    // 5- check if user doesnt change password after signing token
    var passwordChangedAt = user.passwordChangedAt;
    if (passwordChangedAt) {
      var isPasswordChangedAfter =
        passwordChangedAt.getTime() > tokenIssuedAt * 1000;
      if (isPasswordChangedAfter) {
        return res.status(401).json({
          error: "password has been changed, please login again!",
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        error: "you dont have access to perform this action!",
      });
    }
    next();
  };
