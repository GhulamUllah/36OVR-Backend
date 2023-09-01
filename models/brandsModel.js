const mongoose = require("mongoose");

const brand = new mongoose.Schema({
  name: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: true,
  },
  brandimage: {
    type: String,
  },
});

const Brand = mongoose.model("Brand", brand);
module.exports = Brand;
