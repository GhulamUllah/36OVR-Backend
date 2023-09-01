const Brand = require("../models/brandsModel");
const DeliveryAddress = require("../models/DeliveryAddressModel");
const Profile = require("../models/profileModel");

exports.createprofile = async (req, res) => {
  try {
    const user = req.user;
    const { bio, phone, image } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: user },
      { bio, phone, image },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getprofile = async (req, res) => {
  try {
    const user = req.user;
    let profile = await Profile.findOne({ user: user }).populate(["user"]);

    if (!profile) {
      const newProfile = new Profile({ user: user });
      profile = await newProfile.save();
    }

    return res.status(200).json({ success: true, data: profile});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.deleteprofile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(
       req.params.id,
    );
    if (profile) {
      return res.status(200).json({ success: true, id: req.params.id });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updateprofile = async (req, res) => {
  try {
    const user = req.user;
    const { bio, image, phone } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { _user: req.user },
      { bio, image, phone },
      { new: true }
    ).populate("user");
    const data = await profile.save();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
