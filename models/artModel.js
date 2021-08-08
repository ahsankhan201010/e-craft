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
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    gallery: Array, // ["anc.com", "xyz.com"] [1.jpg,2.jpg,3.jpg]
    coverPhoto: String, //2.jpg
    orientation: String, //"landscape"
    subject: String, //"night vision"
    formats: Array, // ["jpg","psd","ai"]
    likes: [mongoose.Schema.ObjectId],
    likesCount: {
      type: Number,
      default: 0,
    },
    viewCount: { //++ on fetch
      type: Number,
      default: 0,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

//virtual properties
// artSchema.virtual("numberOfLikes").get(function () {
//   // this -> art document
//   return this.likes.length;
// });

//virtual populate
artSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "art", //referencing -> populate
  localField: "_id", //referencing -> populate
});

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
