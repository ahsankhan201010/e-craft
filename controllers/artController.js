const Art = require("../models/artModel");
const APIFeatures = require("../utility/commonUntility");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const { shapeArtData } = require("../utility/art");
const { awsImageuploader } = require("../utility/AWS");

const storage = multer.memoryStorage();
exports.uploadArt = multer({ storage: storage }).any();

exports.processArtImages = async (req, res, next) => {
  try {
    var gallery = [];
    var files = req.files;
    var promises = files.map(async (file) => {
      var ext = file.mimetype.split("/")[1];
      var filename = `art-${req.user._id}-${uuid()}-${Date.now()}.${ext}`;
      var { Location } = await awsImageuploader(file, filename);
      gallery.push(Location);
      if (file.fieldname === "coverPhoto") req.body.coverPhoto = Location;
    });
    await Promise.all(promises);
    req.body.gallery = gallery;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     //cb(error, destination)
//     cb(null, "public/images/");
//   },
//   filename: (req, file, cb) => {
//     //cb(error, fieldname)
//     var ext = file.mimetype.split("/")[1];
//     cb(null, `art-${req.user._id}-${uuid()}-${Date.now()}.${ext}`); //art-usedId-random_uuid-154521485.jpg
//   },
// });

// exports.artUpload = multer({ storage: storage }).any();

exports.addArt = async (req, res) => {
  try {
    //adding artist info
    req.body.artist = req.user._id;
    var art = await Art.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.getArts = async (req, res) => {
  try {
    var { limit = 2 } = req.query;
    var query = new APIFeatures(Art, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    var arts = await query.get();

    var totalPages = Math.ceil((await Art.countDocuments()) / limit);
    res.status(200).json({
      status: "success",
      pages: totalPages,
      results: arts.length,
      data: {
        arts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.getSpecficArt = async (req, res) => {
  try {
    var art = await Art.findById(req.params.artId).populate("reviews");

    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.likeArt = async (req, res) => {
  try {
    //update art data
    var { artId } = req.params;
    var { _id: userId } = req.user;
    var art = await Art.findOneAndUpdate(
      {
        _id: artId,
        likes: { $ne: userId },
      },
      {
        $inc: { likesCount: 1 },
        $push: { likes: userId },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.dislikeArt = async (req, res) => {
  try {
    //update art data
    var { artId } = req.params;
    var { _id: userId } = req.user;
    var art = await Art.findOneAndUpdate(
      {
        _id: artId,
        likes: userId,
      },
      {
        $inc: { likesCount: -1 },
        $pull: { likes: userId },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};
