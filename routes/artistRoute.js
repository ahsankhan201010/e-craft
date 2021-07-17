const express = require("express");
const { fetchArtists, addArtist } = require("../controllers/artistController");

const router = express.Router();

// router.route("/").post(addArtist)

module.exports = router;