const mongoose = require("mongoose");

const artSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.ObjectId,
      ref: "User", //exist in user collection
      require: [true, "art must belong to an artist"],
    }, //mongoDb generated string
    title: String, //my first art
    description: String, //my shortd desc
    cost: Number, //$259
    resolutionWidth: Number,
    resolutionHeight: Number,
    likes: Number, //52
    gallery: Array, // ["anc.com", "xyz.com"]
    orientation: String, //"landscape"
    subject: String, //"night vision"
    formats: Array, // ["jpg","psd","ai"]
    likes: [mongoose.Schema.ObjectId],
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

artSchema.pre(/^find/, function (next) {
  //query middleware
  //this -> query
  this.populate({
    path: "artist",
    select: "email username",
  });
  next();
});

const Art = new mongoose.model("Art", artSchema);

module.exports = Art;
