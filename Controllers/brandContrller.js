const Brand = require("../models/brandsModel");
const DeliveryAddress = require("../models/DeliveryAddressModel");

exports.addbrand = async (req, res) => {
  try {
    const user = req.user;
    const { name, brandimage } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Brand Name is Required" });
    }

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Attempt" });
    }
    const brand = await new Brand({
      user: req.user,
      name,
      brandimage,
    });
    const data = await brand.save();
    return res.status(200).json({
      success: true,
      data,
      message: "Brand Added Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.brandlist = async (req, res) => {
  try {
    const user = req.user;
    const brands = await Brand.find({ user: req.user });
    if (brands) {
      return res.status(200).json({ success: true, data: brands });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.deletebrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete({
      _id: req.params.id,
    });
    if (brand) {
      return res.status(200).json({ success: true, id: req.params.id });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updatebrand = async (req, res) => {
  try {
    const user = req.user;
    const { name, brandimage } = req.body;
    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id },
      { name, brandimage },
      { new: true }
    ).populate("user");
    const data = await brand.save();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Address Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
