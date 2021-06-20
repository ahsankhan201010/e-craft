const express = require("express");
const { signup, fetchUsers, login } = require("../controllers/authController");

const router = express.Router();

// router.get("/",(req,res) => {
//     res.status(200).json({
//         status: "success",
//         msg: "auth home route"
//     })
// })
router.get("/",fetchUsers)
router.post("/signup", signup)
router.post("/login",login)

module.exports = router;