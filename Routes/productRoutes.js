const express = require("express");

const router = express.Router();
const {
  getallproducts,
  addproduct,
  updateproduct,
  deleteproduct,
  getsingleproduct,
  getuserproducts,
  getproductsbycatagery,
} = require("../Controllers/productController");
const { auth } = require("../middleware/auth");

router.get("/", getallproducts);
router.get("/userproducts", auth, getuserproducts);

router.get("/:id", getsingleproduct);
router.get("/catagery/:id", getproductsbycatagery);

router.post("/add-product", auth, addproduct);
router.put("/update-product/:id", auth, updateproduct);
router.delete("/delete-product/:id", auth, deleteproduct);

module.exports = router;
