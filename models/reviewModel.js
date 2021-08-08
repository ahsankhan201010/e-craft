const mongoose = require("mongoose");
const Art = require("./artModel");

const reviewSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    }, //populate
    art: mongoose.Schema.ObjectId, //parent referncing
  },
  {
    timestamps: true,
  }
);

//static method can only be called on Model (Review.cal)
reviewSchema.statics.calculateAvgRating = async function (artId) {
  //this -> model -> Review model
  var stats = await this.aggregate([
    {
      $match: { art: artId },
    },
    {
      $group: {
        _id: "$art", //grouping on the basis of ...
        avgRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    //save data in art document
    var art = await Art.findByIdAndUpdate(
      artId,
      {
        avgRating: stats[0].avgRating,
        numberOfReviews: stats[0].numberOfReviews,
      },
      { new: true }
    );
    console.log(art);
  } else {
    var art = await Art.findByIdAndUpdate(
      artId,
      {
        avgRating: 0,
        numberOfReviews: 0,
      },
      { new: true }
    );
    console.log(art);
  }
};

reviewSchema.pre(/^find/, function (next) {
  //query middleware
  //this -> query
  this.populate({
    path: "reviewedBy",
    select: "username email",
  });
  next();
});

reviewSchema.post("save", function () {
  //this -> document (saved)
  //this.constructor -> Model (Review)
  this.constructor.calculateAvgRating(this.art);
  console.log("saved");
  //there is no next
  //calculate avg here
  //access model
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this -> query {_id, reviewedBy}
  this.doc = await this.findOne();

  // this -> query  -----> model
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //this.doc -> document -> Model (cons..)
  this.doc.constructor.calculateAvgRating(this.doc.art);
  // this -> query  -----> model
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
