const Art = require("../models/artModel");

exports.addArt = async (req, res) => {
  try {
    console.log(req.body);
    var art = await Art.create(req.body);
    console.log(art);
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
  var { role, moreData, ...resQueries } = req.query;
  try {
    //modelled query
    var { role, moreData, ...resQueries } = req.query;
    var queryStr = JSON.stringify(resQueries);
    var query = queryStr.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`
    );
    var queryObj = JSON.parse(query);
    //passed the query
    var arts = await Art.find(queryObj);
    res.status(200).json({
      status: "success",
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
