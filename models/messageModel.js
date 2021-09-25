const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: "",
    },
    contentType: {
      type: String,
      enum: ["text", "img", "video", "audio"],
      default: "text"
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    seen: {
        type: Boolean,
        default: false
    },
    received: {
        type: Boolean,
        default: false
    },
  },
  {
    timestamps: true,
  }
);

var Message = new mongoose.model("Message", messageSchema);
module.exports = Message;
