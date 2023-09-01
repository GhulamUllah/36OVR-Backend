const express = require("express");

const router = express.Router();
const {
  addaddress,
  d_addressess,
  deleteaddress,
  updateaddress,
} = require("../Controllers/deliveryAddressController");
const { auth } = require("../middleware/auth");

router.post("/addaddress", auth, addaddress);
router.get("/", auth, d_addressess);
router.put("/:id", auth, updateaddress);
router.delete("/:id", auth, deleteaddress);

module.exports = router;
