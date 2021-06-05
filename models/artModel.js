const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
 title: String, //my first art
 description: String, //my shortd desc
 cost: Number, //$259
 resolution: String, //1920x1080
 likes: Number, //52
 reviews: [
   {
     content: String, //nice art
     reviewdBy: String, //122855
     rating: Number //3
   }
 ],
 gallery: Array, // ["anc.com", "xyz.com"]
 orientation: String, //"landscape"
 subject: String, //"night vision"
 formats: Array, // ["jpg","psd","ai"]
}, {
  timestamps: true
});

const Art = new mongoose.model("Art", artSchema);

module.exports = Art;
