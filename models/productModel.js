const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shops",
    required: true,
  },
  productTitle: {
    type: String,
    require: true,
  },
  productDescription: {
    type: String,
    require: true,
  },
  images: {
    type: Array,
  },
  price: {
    type: Number,
    required: true,
  },
  catagery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catagery",
    require: true,
  },
  subcatagery: {
    type: String,
    require: true,
  },
  instock: {
    type: Number,
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Number,
  },
  brand: {
    type: "String",
    reqiured: "true",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
});

const Product = mongoose.model("Products", productModel);

module.exports = Product;
