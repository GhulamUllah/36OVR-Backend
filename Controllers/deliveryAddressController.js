const DeliveryAddress = require("../models/DeliveryAddressModel");

exports.addaddress = async (req, res) => {
  try {
    const user = req.user;
    const { email, phone, country, city, postalcode, streetaddress } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email Name is Required" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is Required" });
    }
    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country is Required" });
    }
    if (!city) {
      return res
        .status(400)
        .json({ success: false, message: "City is Required" });
    }
    if (!postalcode) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Postal Code" });
    }
    if (!streetaddress) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Street Address" });
    }
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Attempt" });
    }
    const address = await new DeliveryAddress({
      user: req.user,
      email,
      phone,
      country,
      city,
      postalcode,
      streetaddress,
    });
    const data = await address.save();
    return res.status(200).json({
      success: true,
      data,
      message: "Delivey Address Added Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.d_addressess = async (req, res) => {
  try {
    const user = req.user;
    const addressess = await DeliveryAddress.find({ user: req.user }).populate(
      "user"
    );
    if (addressess) {
      return res.status(200).json({ success: true, data: addressess });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.deleteaddress = async (req, res) => {
  try {
    const addressess = await DeliveryAddress.findByIdAndDelete({
      _id: req.params.id,
    });
    if (addressess) {
      return res.status(200).json({ success: true, id: req.params.id });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updateaddress = async (req, res) => {
  try {
    const user = req.user;
    const { email, phone, country, city, postalcode, streetaddress } = req.body;
    const addressdata = await DeliveryAddress.findOneAndUpdate(
      { _id: req.params.id },
      { email, phone, country, city, postalcode, streetaddress },
      { new: true }
    ).populate("user");
    const data = await addressdata.save();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Address Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
