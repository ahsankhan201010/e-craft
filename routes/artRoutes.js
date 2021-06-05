const express = require("express");
const { addArt, getArts } = require("../controllers/artController");

const router = express.Router();

router.get("/",getArts)
router.post("/", addArt);

module.exports = router;
