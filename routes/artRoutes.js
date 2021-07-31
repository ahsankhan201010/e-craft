const express = require("express");
const {
  addArt,
  getArts,
  getSpecficArt,
  likeArt,
  dislikeArt,
  uploadArt,
  processArtImages,
} = require("../controllers/artController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./../routes/reviewRoute");

const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const router = express.Router();

//redireticng to review router

router.use("/:artId/reviews", reviewRouter);

router
  .route("/")
  .get(getArts)
  .post(protect, uploadArt, processArtImages, addArt);
router.route("/:artId").get(getSpecficArt);
router.post("/:artId/like", protect, likeArt);
router.post("/:artId/dislike", protect, dislikeArt);

module.exports = router;
