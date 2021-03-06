const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Order = require("../models/orderModel");
const Art = require("./../models/artModel");
const { pushNotification } = require("./notificationController");
exports.generateCheckoutSession = async (req, res) => {
  try {
    //fetch art
    var { artId } = req.params;
    //retrieve data and pass it to session obj
    var art = await Art.findById(artId);
    var {
      title,
      description,
      cost,
      coverPhoto,
      artist: { _id: artistId },
    } = art;
    //generating stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        buyer: `${req.user._id}`,
        artist: `${artistId}`,
        art: artId,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images: [coverPhoto],
              description,
            },
            unit_amount: parseFloat(cost.toFixed(2) * 100), //we need to conve  to convert this into cents
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/`,
    });
    res.status(200).json({
      status: "success",
      data: {
        session,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.stripeWebhook = async (request, response) => {
  try {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(error);
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      //generating order
      var {
        data: {
          object: { metadata },
        },
      } = event;
      await Order.create(metadata);
      //changing art status to sold
      var art = await Art.findByIdAndUpdate(metadata.art, {status: "sold"})
      //save event.data.object details to transaction collection
    }

    response.json({ received: true });
    //sending notification to artist
    // pushNotification({user: art.artist, title: "you have a new order!"})
  } catch (error) {
    console.log(error);
  }
};
