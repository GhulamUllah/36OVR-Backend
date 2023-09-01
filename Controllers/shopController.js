const Product = require("../models/productModel");
const Shop = require("../models/shopModel");

exports.getallshops = async (req, res) => {
  try {
    let shops;

    // const page = req.query.page;
    // const limit = 9;
    // const startindex = (page - 1) * limit;
    // const lastindex = page * limit;

    if (req.body.data) {
      shops = await Shop.find({
        $or: [
          { shopname: req.body.data.shopname },
          { catagery: req.body.data.catagery },
          { country: req.body.data.country },
        ],
      }).populate(["products", "owner"]);
      console.log(shops);
    } else {
      shops = await Shop.find().populate(["products", "owner"]);
    }

    // .limit(limit)
    // .skip(startindex)
    // console.log(shops);
    if (shops) {
      return res.status(200).json({ success: true, data: shops });
    }
    return res.status(200).json({ success: true, message: "No Shop Found" });
  } catch (error) {
    console.log(error.message);
  }
};
exports.getsingleshop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id }).populate([
      "products",
      "owner",
    ]);

    return res.status(200).json({ success: true, data: shop });
  } catch (error) {
    console.log(error);
  }
};
exports.addshop = async (req, res) => {
  try {
    const {
      shopname,
      aboutShop,
      catagery,
      shopavatar,
      shopphone,
      country,
      city,
      streetaddress,
      shopbanner,
      Shoptype,
      Brands,
    } = req.body;
    console.log(req.body);
    if (!shopname) {
      return res
        .status(400)
        .json({ success: false, message: "Shop Name is required" });
    }
    if (!aboutShop) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }
    if (!catagery) {
      return res
        .status(400)
        .json({ success: false, message: "Catagery is required" });
    }

    if (!shopavatar) {
      return res
        .status(400)
        .json({ success: false, message: "Please Add Shop Logo" });
    }
    if (!shopbanner) {
      return res
        .status(400)
        .json({ success: false, message: "Please Add Shop Banner" });
    }
    if (!Brands) {
      return res
        .status(400)
        .json({ success: false, message: "At least one Brand is required" });
    }
    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country is Required" });
    }
    if (!city) {
      return res
        .status(400)
        .json({ success: false, message: "City is required" });
    }
    if (!shopphone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });
    }
    if (!Shoptype) {
      return res
        .status(400)
        .json({ success: false, message: "Please Select Type" });
    }
    const shop = new Shop({
      owner: req.user,
      shopname,
      aboutShop,
      catagery,
      shopavatar,
      shopphone,
      country,
      city,
      streetaddress,
      Brands,
      Shoptype,
      shopbanner,
    });
    const data = await shop.save();
    return res
      .status(200)
      .json({ success: true, data, message: "Shop Added Successfully" });
  } catch (error) {
    console.log(error);
  }
};
exports.updateshop = async (req, res) => {
  try {
    const {
      previmage,
      shopname,
      aboutShop,
      catagery,
      subcatagery,
      shopavatar,
      shopphone,
      country,
      owner,
      city,
      streetaddress,
      shopbanner,
      Shoptype,
      Brands,
    } = req.body;
   let img=[...previmage,shopbanner]
   
    const shopp = await Shop.findOneAndUpdate(
      { _id: req.params.id },
      {
        shopname,
        aboutShop,
        catagery,
        subcatagery,
        shopavatar,
        shopphone,
        owner,
        country,
        city,
        shopbanner:img,
        streetaddress,
        Shoptype,
        Brands,
      },
      { new: true }
    ).populate("owner");
    
    const shop = await shopp.save();
    return res.status(200).json({ success: true, data: shop });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteshop = async (req, res) => {
  try {
    const shop = await Shop.findById({ _id: req.params.id });
    if ((req.user._id = shop.owner)) {
      await Shop.findOneAndDelete({ _id: req.params.id });
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ success: false });
  } catch (error) {
    console.log(error);
  }
};
exports.getusershops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user }).populate([
      "products",
      "owner",
    ]);
    if (shops) {
      return res.status(200).json({ success: true, data: shops });
    }
    return res.status(200).json({ success: true, message: "No Active Shops" });
  } catch (error) {
    console.log(error);
  }
};
