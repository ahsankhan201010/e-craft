const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

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
    var {password, ...modifiedUser} = user.toObject() //simple object
    //generate JWT
    var token = JWT.sign({ id: user._id }, process.env.JWT_WEB_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
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
