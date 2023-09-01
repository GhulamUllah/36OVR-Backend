const mongoose = require("mongoose");

const profile = new mongoose.Schema({
  bio: {
    type: String,
  },
  phone: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: true,
  },
  image: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profile);
module.exports = Profile;
