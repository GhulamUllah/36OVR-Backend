const express = require("express");

const router = express.Router();
const {
  initorder,
  getorderc,
  getsingleorder,
  getorders,
  updateorder,
  selleracount,
  check,
  ordercomplete,
  getpayments,
  getallorders,
  clearpayments,
  getallpayments,
  transferfunds,
  myOrder,
  deletemyOrder,
  updateuserOrder,
  getmyUserorders,
  getalldeleteOrder,
  getmydeleteOrder,
  getmyallorders
} = require("../Controllers/orderController");
const { auth } = require("../middleware/auth");

router.get("/paymentt", auth, getpayments);
router.get("/getallpayments", auth, getallpayments);
router.get("/clearpayments", auth, clearpayments);
router.get("/transferfunds", auth, transferfunds);

router.get("/all", auth, getallorders);

router.post("/create-order", auth, initorder);
router.get("/ordersc", auth, getorderc);
router.get("/orderss", auth, getorders);
router.put("/:id", auth, updateorder);
router.get("/connect", auth, selleracount);
router.get("/check", auth, check);
router.get("/getallorders", auth, getallorders);
router.get("/getmydeletedorders", auth, getmyUserorders);
router.get("/getalldeleteOrder", auth, getalldeleteOrder);
router.post("/create", auth, myOrder);
router.put("/update/:id", auth, updateuserOrder);
router.get("/get-user-orders", auth, getmyUserorders);
router.delete("/delete-order/:id", auth, deletemyOrder);

router.get("/:id", auth, getsingleorder);
router.put("/complete/:id", auth, ordercomplete);

module.exports = router;
