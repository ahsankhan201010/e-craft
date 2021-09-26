const express = require("express");
const { protect } = require("../controllers/authController");
const {
  fetchConversation,
  fetchConversations,
} = require("./../controllers/conversationController");

const router = express.Router();

// router.get("/",(req,res) => {
//     res.status(200).json({
//         msg: "convo"
//     })
// })

router.get("/", protect, fetchConversations);
router.get("/:orderId", protect, fetchConversation);

module.exports = router;
