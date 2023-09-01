const mongoose = require("mongoose");

const order = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    // required: true,
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: { type: Number, required: true },
      price: { type: Number },
    },
  ],
  cart:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cart",
    required:true
  },
  ordertotal: {
    type: Number,
    required: true,
  },
  ispaid: {
    type: String,
    enum: ["Paid", "Not Paid"],
    default: "Paid",
  },
  orderstatus: {
    type: String,
    enum: ["Accepted", "Rejected", "Incomming", "completed"],
    default: "Incomming",
  },
  deliverystatus: {
    type: String,
    enum: ["Pending", "Delivered", "Completed"],
    default: "Pending",
  },
  deliverydate: {
    type: Date,
  },
  shippingfee: {
    type: Number,
    default: 0,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  iscompleted: {
    type: Boolean,
    default: false,
  },
  deliverydetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAddress",
    required: true,
  },
});

const Order = mongoose.model("Order", order);

module.exports = Order;
