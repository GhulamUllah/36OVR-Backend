// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const express = require('express');
const router = express.Router();
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY)

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: req.body.cartItems.map((item)=>{
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.productTitle,
          description:item.product.productDescription,
          images: item.product.images
        },
        unit_amount: (item.product.price - item.product.discount)*100,
      },
      quantity: item.quantity,
      
    }

    }),
    customer_email:req.body.email,
      
    mode: 'payment',
   
    success_url: 'https://ecommerce-tau-umber.vercel.app/Auth/Cart/Payment/Success',
    cancel_url: 'https://ecommerce-tau-umber.vercel.app/Auth/Cart/Payment/Cancel',
  });

  res.status(200).send({success:true, data:session.id});
});
module.exports = router
