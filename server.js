require("dotenv").config();
const express = require("express")
// const app = require("./app");
const app = express()
// const mongoose = require("mongoose");

// const DB = process.env.MONGO_STRING.replace(
//   "<PASSWORD>",
//   process.env.MONGO_PASSWORD
// );
// mongoose
//   .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((con) => {
//     console.log("connected to mogndodb");
//   });

app.listen(process.env.PORT, () => {
  console.log("server running on port 8000");
});
