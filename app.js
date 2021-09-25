const express = require("express");
const artRouter = require("./routes/artRoutes");
const authRouter = require("./routes/authRoute");
const artistRouter = require("./routes/artistRoute");
const buyerRouter = require("./routes/buyerRoute");
const orderRouter = require("./routes/orderRoute");
const notificationRouter = require("./routes/notificationRoute");
const conversationRouter = require("./routes/conversationRoute");
const messageRouter = require("./routes/messageRoute");
const rateLimit = require("express-rate-limit"); //for brute force attack
const mongoSanitize = require("express-mongo-sanitize"); //for noSql query injections
const xss = require("xss-clean"); //for XSS attack (remove script tags)
const cors = require('cors');
const { stripeWebhook } = require("./controllers/orderController");
const bodyParser = require("body-parser")

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1hr
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "you've exceed the number of requests",
});

const app = express();

//implementing cors
app.use(cors({origin: true, credentials: true}))
//serving static content
app.use(express.static("public"));
//middlewares
app.use(limiter);

//stripe webhook
app.post("/stripe-webhook", bodyParser.raw({type: 'application/json'}), stripeWebhook)

app.use(express.json());

app.use(mongoSanitize());
app.use(xss());

//routers
app.use("/api/v1/arts", artRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/artists", artistRouter);
app.use("/api/v1/buyers", buyerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);

module.exports = app;
