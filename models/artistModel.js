const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "user name is required!"],
  },
  email: {
    type: String,
    unique: true, //indexing
    required: true, //TODO: check email pattern //validation
    lower: true, // user@gmail.com & User@gmail.com //modification
  },
  displayPicture: {
    type: String,
    default: "default.png",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "user id is required!"],
  },
  role: {
    type: String,
    default: "artist"
  },
  paypal: String,
  address: {
    country: String,
    city: String,
    street: String,
    state: String,
    zip: String
  }
}, {
    timestamps: true
});

var Artist = new mongoose.model("Artist", artistSchema);
module.exports = Artist;
