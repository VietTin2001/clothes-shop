const { request } = require("express");
const express = require("express");
const Stripe = require("stripe");
//const { Order } = require("../models/Order");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();
const CLIENT_URL= "http://localhost:3000"

router.post("/create-checkout-session", async (req, res) => {

    const customer = await stripe.customers.create({
        metadata: {
          userId: req.body.userId,
          cart: JSON.stringify(req.body.cartItems),
        },
      });

    const line_items = req.body.cartItems.map((item) =>{
        console.log(item)
            return{
                price_data:{
                    currency: "vnd",
                    product_data:{
                    name: item.slug,
                    image: item.image,
                    description: item.description,
                    metadata:{
                            id: item.id,
                        },
                    },
                    unit_amount: item.price ,
                },
                quantity: item.quantity,
            }
    })


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE","VN"],
        },
        shipping_options: [
        {
            shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
                amount: 0,
                currency: "vnd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
                minimum: {
                unit: "business_day",
                value: 5,
                },
                maximum: {
                unit: "business_day",
                value: 7,
                },
            },
            },
        },
        {
            shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
                amount: 1500,
                currency: "vnd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
                minimum: {
                unit: "business_day",
                value: 1,
                },
                maximum: {
                unit: "business_day",
                value: 1,
                },
            },
            },
        },
        ],
        phone_number_collection: {
        enabled: true,
        },
        line_items,
        customer: customer.id,
        mode:"payment",
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    res.send({url: session.url});



//   // res.redirect(303, session.url);
//   res.send({ url: session.url });
// });

// // Create order function

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const products = Items.map((item) => {
    return {
      productId: item.id,
      quantity: item.quantity,
    };
  });

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// // Stripe webhoook

//This is your Stripe CLI webhook secret for testing your endpoint locally.
let webhookSecret = 'whsec_fe0b31f64a8198088a0b4a5bbe739a443c5501b2f708b29ed1cca7cdf65c354c'

// router.post("/webhook",express.json({ type: "application/json" }),async (req, res)=>{

//     let data;
//     let eventType;
//     const sig = req.headers['strip-signature'];
//     if(endpoint_secret){
//         let event;

//     try{
//         event= stripe.webhook.constructEvent( req.body, sig, endpoint_secret)
//         console.log("Webhook verified.");
//         }
//     catch(err){
//         console.log(`Webhook Error: ${err.message}`);
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;


//     }

//     data = event.data.object
//     eventType = event.type;
//     }else{
//         data = req.body.data.object;
//         eventType = req.body.type
//     }
    

//     //handle event
//    if(eventType=== "checkout.session.completed"){
   
//     stripe.customers.retrieve(data.customer).then(async (customer) =>{
//         console.log(customer)
//         console.log("data:", data)
//     }).catch(err => console.log(err.message));

//     }
//     res.send().end();
// });
    

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(` Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
            console.log("data:", data)
            console.log(customer)
          try {
            // CREATE ORDER
            createOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
   }
)});

module.exports = router