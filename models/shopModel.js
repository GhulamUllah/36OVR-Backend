const mongoose = require("mongoose");

const shopModel = new mongoose.Schema({
  shopname: {
    type: String,
    required: true,
  },
  aboutShop: {
    type: String,
    required: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  shopphone: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  streetaddress: {
    type: String,
  },
  catagery: {
    type: String,
  },
  subcatagery: {
    type: String,
  },
  Brands: {
    type: Array,
  },
  Shoptype: {
    type: "String",
    enum: ["Service", "Retail", "Whole Sale"],
    default: "Retail",
  },
  shopavatar: {
    type: Array,
  },
  shopbanner: {
    type: Array,
  },
});

const Shop = mongoose.model("Shops", shopModel);

module.exports = Shop;
