const User = require("../models/userModel");

exports.signup = async (req, res) => {
  try {
      //encryption
    var user = await User.create(req.body)
    // console.log(user)
    res.status(200).json({
      status: "success",
      data: {
          user
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error: error.message,
    });
  }
};
