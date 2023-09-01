const mongoose = require("mongoose");

const catageryModel = new mongoose.Schema({
  catagery_name: {
    type: String,
    require: true,
    unique: true,
  },
  categoryImage: { 
    type: String 
  },
  parentId: {
    type: String,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  updatesat: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    // required: true,
  },
});

const Catagery = mongoose.model("Catagery", catageryModel);

module.exports = Catagery;
