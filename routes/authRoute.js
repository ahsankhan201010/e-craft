const express = require("express");
const { signup } = require("../controllers/authController");

const router = express.Router();

// router.get("/",(req,res) => {
//     res.status(200).json({
//         status: "success",
//         msg: "auth home route"
//     })
// })
router.post("/signup", signup)

module.exports = router;