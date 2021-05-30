const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rating: Number,
  cost: Number,
});

const Art = new mongoose.model("Art", artSchema);

module.exports = Art;
