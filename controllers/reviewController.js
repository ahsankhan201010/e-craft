const Review = require("../models/reviewModel");

exports.postReview = async (req, res) => {
  try {
    var { artId } = req.params;
    var { _id: userId } = req.user;
    //appending two fields
    req.body.art = artId;
    req.body.reviewedBy = userId;
    var review = await Review.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    var { reviewId } = req.params;
    var filter = {
        _id: reviewId,
        reviewedBy: req.user._id
    }
    var review = await Review.findOneAndUpdate(filter, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
          review
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
    try {
      var { reviewId } = req.params;
      var filter = {
          _id: reviewId,
          reviewedBy: req.user._id
      }
      var review = await Review.findOneAndDelete(filter);
      res.status(401).json({
        status: "success",
        data: {
            review
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: error.message,
      });
    }
  };

exports.getReviews = async (req, res) => {
  try {
    console.log(req.params);
    res.status(200).json({
      status: "success",
      msg: "get reviews",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

// exports.fetchReviewsOfSpecificArt =
