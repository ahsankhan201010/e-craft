const express = require("express");
const {
  signup,
  fetchUsers,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// router.get("/",(req,res) => {
//     res.status(200).json({
//         status: "success",
//         msg: "auth home route"
//     })
// })
router.get("/", fetchUsers);
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
