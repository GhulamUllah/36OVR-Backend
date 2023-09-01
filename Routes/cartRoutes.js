const express = require("express");

const router = express.Router();
const {
  additemtocart,
  getusercart,
  removeitemfromcart,
  cartitemdescreament,
  clearCart,
  cartitemincreament,
  clearCartAdmin
} = require("../Controllers/cartController");
const { auth } = require("../middleware/auth");

router.post("/additemtocart/:id", auth, additemtocart);
router.post("/clear-cart", auth, clearCart);
router.post("/clear-cart-admin", auth, clearCartAdmin);
router.post("/removeitemfromcart/:id",auth, removeitemfromcart);
router.post("/cartitemdecreament/:id/:storeid", auth, cartitemdescreament);
router.post("/cartitemincreament/:id/:storeid", auth, cartitemincreament);

router.get("/", auth, getusercart);

module.exports = router;
