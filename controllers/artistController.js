const Artist = require("./../models/artistModel");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const { awsImageuploader } = require("../utility/AWS");

const storage = multer.memoryStorage();
exports.uploadProfilePicture = multer({ storage: storage }).single(
  "displayPicture"
);

exports.processProfilePicture = async (req, res, next) => {
  if (req.file) {
    var file = req.file;
    var ext = file.mimetype.split("/")[1];
    var filename = `artist-${req.user._id}-${uuid()}-${Date.now()}.${ext}`;
    var { Location } = await awsImageuploader(file, filename);
    req.body.displayPicture = Location;
  }
  next();
};

exports.fetchArtists = async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({
      status: "success",
    });
  } catch (error) {}
};

exports.addArtist = async (artistProfile) => {
  try {
    var artist = await Artist.create(artistProfile);
    return artist;
  } catch (error) {
    return new Error(error.message);
  }
};

exports.fetchArtist = async (artistId) => {
  try {
    var artist = await Artist.findOne({ userId: artistId });
    return artist;
  } catch (error) {
    return new Error(error.message);
  }
};

exports.updateArtistProfile = async (req, res) => {
  try {
    var {_id, userId, email, role, ...restProfileData} = req.body;
    var artist = await Artist.findOneAndUpdate({userId: req.user._id}, restProfileData, {
      new: true, //return new updated data
      runValidators: true, //validate fields before updating
    });
    res.status(200).json({
      status: "success",
      data: {
        artist
      }
    });
  } catch (error) {
    console.log(error);
    return new Error(error.message);
  }
};
