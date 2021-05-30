const express = require("express");
const { addArt } = require("../controllers/artController");

const router = express.Router();

router.post("/", addArt);

module.exports = router;
