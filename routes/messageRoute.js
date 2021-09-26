const express = require("express");
const { sendMessage } = require("../controllers/messageController");
const { protect } = require("../controllers/authController");

const router = express.Router();

// router.get("/",(req,res) => {
//     res.status(200).json({msg: "msg"})
// })

router.post("/:conversationId", protect, sendMessage);

module.exports = router;
