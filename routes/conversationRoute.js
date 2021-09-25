const express = require("express");
const { protect } = require("../controllers/authController");
const {
  fetchConversation,
} = require("./../controllers/conversationController");

const router = express.Router();

// router.get("/",(req,res) => {
//     res.status(200).json({
//         msg: "convo"
//     })
// })

router.get("/:orderId", protect, fetchConversation);

module.exports = router;
