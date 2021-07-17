const Artist = require("./../models/artistModel");
exports.fetchArtists = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      msg: "fetch arttist",
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
