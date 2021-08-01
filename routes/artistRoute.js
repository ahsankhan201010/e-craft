const express = require("express");
const {
  fetchArtists,
  addArtist,
  updateArtistProfile,
  uploadProfilePicture,
  processProfilePicture,
} = require("../controllers/artistController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(addArtist)
  .patch(
    protect,
    restrictTo("artist"),
    uploadProfilePicture,
    processProfilePicture,
    updateArtistProfile
  );

module.exports = router;
