const mongoose = require("mongoose");

const cartModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shops",
  },
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: { type: Number, default: 1, min:[1,'must be at least one'] },
    },
  ],
  carttotal: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", cartModel);

module.exports = Cart;
