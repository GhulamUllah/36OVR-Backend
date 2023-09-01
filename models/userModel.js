const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "buyer", "seller"],
    default: "buyer",
  },
  resettoken: {
    type: String,
    default: "",
  },
  isverifiedemail: {
    type: Boolean,
    default: false,
  },
  verifyemailtoken: {
    type: String,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  stripeid: {
    type: String,
  },
  stripeaccount: {
    type: Object,
  },
  seller_request: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 100,
  },
  
});

const User = mongoose.model("Users", userModel);

module.exports = User;
