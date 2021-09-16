const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  art: {
      type: mongoose.Schema.ObjectId,
      ref: "art",
      required: true
  },
  buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "buyer",
      required: true
  },
  artist: {
      type: mongoose.Schema.ObjectId,
      ref: "artist",
      required: true
  },
}, {
    timestamps: true
});

var Order = new mongoose.model("Order", orderSchema);
module.exports = Order;
