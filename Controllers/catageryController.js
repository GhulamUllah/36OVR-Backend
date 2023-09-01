const Catagery = require("../models/catageryModel");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.catagery_name,
      parentId: cate.parentId,
      type: cate.type,
      image: cate.categoryImage,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addcatagery = async (req, res) => {
  try {
    if (!req.body.catagery_name) {
      return res
        .status(400)
        .json({ success: false, message: "Catagery Name is required" });
    }
    const isunique = await Catagery.findOne({
      catagery_name: req.body.catagery_name,
    });

    if (isunique) {
      console.log(isunique);
      return res
        .status(400)
        .json({ success: false, message: "Catagery Already Exists" });
    }
    const categoryObj = {
      catagery_name: req.body.catagery_name,
      created_by: req.user,
    };

    if (req.body.categoryImage) {
      categoryObj.categoryImage = req.body.categoryImage;
    }

    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }

    const cat = await new Catagery(categoryObj);
    const catageries = await cat.save();
    return res.status(200).json({
      success: true,
      catagery: catageries,
      message: "Catagery Added Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getallcatageries = async (req, res) => {
  try {
    const catageries = await Catagery.find();
    if (catageries) {
      const categoryList = createCategories(catageries);
      return res.status(200).json({ categoryList, success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};
exports.getcatagerybyid = async (req, res) => {
  try {
    const catageries = await Catagery.find({
      _id: req.params.id,
    });
    const list = await Catagery.find();
    if (catageries) {
      const categoryList = createCategories(list, req.params.id);
      return res.status(200).json({ categoryList, success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.getallcatagerieslist = async (req, res) => {
  try {
    const catageries = await Catagery.find();
    if (catageries) {
      return res.status(200).json({ categoryList: catageries, success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.getsinglecatagery = async (req, res) => {
  try {
    const catagery = await Catagery.find({ catagery_name: req.params.name });
    console.log(catagery);
    if (catagery) {
      const categoryList = createCategories(catagery);
      return res.status(200).json({ categoryList, success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};
exports.editcatagery = async (req, res) => {
  try {
    const { catagery_name, parentId, categoryImage } = req.body;
    const catagery = await Catagery.findOneAndUpdate(
      { _id: req.params.id },
      { catagery_name, parentId, categoryImage },
      { new: true }
    );
    console.log(catagery);
    if (catagery) {
      // const categoryList = createCategories(catagery);
      return res.status(200).json({ catagery, success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};
