const express = require("express");
const { protect } = require("../controllers/authController");
const { getReviews, postReview } = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router.route("/").post(protect, postReview);

module.exports = router;

//POST (art/:artId)/reviews
//GET (art/:artId)/reviews
