const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.ObjectId],
      required: true,
    },
    conversationType: {
      type: String,
      enum: ["simple_order", "custom_order", "direct"],
      required: true,
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

var Conversation = new mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
