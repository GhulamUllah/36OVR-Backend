const mongoose = require("mongoose");

const deliveryaddress = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "Users", require: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  postalcode: { type: Number, required: true },
  streetaddress: { type: String, required: true },
});

const DeliveryAddress = mongoose.model("DeliveryAddress", deliveryaddress);

module.exports = DeliveryAddress;
