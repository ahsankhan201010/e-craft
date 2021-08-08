const express = require("express");
const { protect } = require("../controllers/authController");
const { getReviews, postReview, updateReview, deleteReview } = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router.route("/").post(protect, postReview);
router.route("/:reviewId").patch(protect, updateReview);
router.route("/:reviewId").delete(protect, deleteReview);

module.exports = router;

//POST (art/:artId)/reviews
//GET (art/:artId)/reviews
