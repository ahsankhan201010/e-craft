const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Art = require("./../models/artModel");
exports.generateCheckoutSession = async (req, res) => {
  try {
    //fetch art
    var { artId } = req.params;
    //retrieve data and pass it to session obj
    var art = await Art.findById(artId);
    var { title, description, cost, coverPhoto, artist: {_id : artistId} } = art;
    //generating stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        buyer: `${req.user._id}`,
        artist: `${artistId}`,
        art: artId
      },
      line_items: [
        {
          price_data: {
              currency: "usd",
              product_data: {
                  name: title,
                  images: [coverPhoto],
                  description
              },
              unit_amount: parseFloat(cost.toFixed(2) * 100) //we need to conve  to convert this into cents
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
          session
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.stripeWebhook = (request,response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    console.log(error)
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event)


  if(event.type === "checkout.session.completed") {
    console.log("yeah! payment session completed successfully")
  }
  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntent = event.data.object;
  //     console.log('PaymentIntent was successful!');
  //     break;
  //   case 'payment_method.attached':
  //     const paymentMethod = event.data.object;
  //     console.log('PaymentMethod was attached to a Customer!');
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}
