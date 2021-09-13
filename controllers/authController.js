const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const sendEmail = require("../utility/email");
const { addArtist, fetchArtist } = require("./artistController");
const { addBuyer, fetchBuyer } = require("./buyerController");

const signJWT = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, res) => {
  var token = signJWT(user.userId);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "development" ? false : true, //this will only valid for HTTPS connection
    httpOnly: process.env.NODE_ENV === "development" ? false : true, //transfer only in http/https protocols
  });
  res.status(200).json({
    status: "success",
    token: process.env.NODE_ENV === "development" ? token : null,
    data: {
      user,
    },
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
    //profile creation
    var profile = {
      username: user.username,
      email: user.email,
      userId: user._id,
    };
    var userProfile = null;
    if (user.role === "artist") userProfile = await addArtist(profile);
    if (user.role === "buyer") userProfile = await addBuyer(profile);

    createAndSendToken(userProfile, res);
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
    var userProfile = null;
    //fetching profile
    if (user.role === "artist") userProfile = await fetchArtist(user._id);
    if (user.role === "buyer") userProfile = await fetchBuyer(user._id);
    createAndSendToken(userProfile, res);
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
      req.headers.authorization.startsWith("Bearer") // authorization: Bearer {token}
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

exports.forgotPassword = async (req, res) => {
  try {
    var { email } = req.body;
    //1 - fetch user on the basis of email
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "no user found!",
      });
    }
    //2 - generate reset token
    var resetToken = user.passwordResetTokenGenerator();
    await user.save({ validateBeforeSave: false }); //saving already existing doc
    //3 - send it to user's email
    var msg = `please click to that link for changing your password, note that the link will expires in 10 min -  http://localhost:8000/api/v1/auth/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: "password reset token",
      content: msg,
    });
    res.status(200).json({
      status: "success",
      msg: "reset token has been sent to the email",
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //get user on the basis of passwordResetToken
    var { token } = req.params;
    var { password, passwordConfirm } = req.body;
    var encryptedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    var user = await User.findOne({
      passwordResetToken: encryptedResetToken,
      passwordResetTokenExpiresAt: { $gt: Date.now() },
    });
    //if user doesnt exist then send error in response
    if (!user) {
      return res.status(401).json({
        error: "token doesnt exist or has been expired!",
      });
    }
    //set user new password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    await user.save();
    createAndSendToken(user, res);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.updatePassword = () => {
  //currentPassword
  //password
  //passwordConfirm
};
