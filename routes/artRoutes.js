const express = require("express");
const {
  addArt,
  getArts,
  getSpecficArt,
  likeArt,
  dislikeArt,
} = require("../controllers/artController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getArts).post(protect, restrictTo("artist"), addArt);
router.route("/:artId").get(getSpecficArt);
router.post("/:artId/like", protect, likeArt);
router.post("/:artId/dislike", protect, dislikeArt);

module.exports = router;
