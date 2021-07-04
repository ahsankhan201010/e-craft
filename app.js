const express = require("express");
const artRouter = require("./routes/artRoutes");
const authRouter = require("./routes/authRoute");
const rateLimit = require("express-rate-limit"); //for brute force attack
const mongoSanitize = require('express-mongo-sanitize'); //for noSql query injections
const xss = require('xss-clean') //for XSS attack (remove script tags)

const limiter = rateLimit({ 
    windowMs: 60 * 60 * 1000, // 1hr
    max: 1000, // limit each IP to 100 requests per windowMs
    message: "you've exceed the number of requests"
  });

const app = express();

//middlewares
app.use(limiter)
app.use(express.json());
app.use(mongoSanitize());
app.use(xss())

//routers
app.use("/api/v1/arts", artRouter);
app.use("/api/v1/auth", authRouter);

module.exports = app;
