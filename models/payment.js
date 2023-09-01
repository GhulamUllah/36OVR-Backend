const mongoose = require("mongoose");

const payment = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "available"],
    default: "pending",
  },

  createdat: {
    type: Date,
    default: Date.now,
  },
  iscompleted: {
    type: Boolean,
    default: false,
  },
});

const Payment = mongoose.model("Payment", payment);

module.exports = Payment;
