const express = require("express");

const router = express.Router();
const {
  getallshops,
  getsingleshop,
  addshop,
  updateshop,
  deleteshop,
  getusershops,
} = require("../Controllers/shopController");
const { auth } = require("../middleware/auth");

router.get("/", getallshops);
router.get("/usershops", auth, getusershops);

router.get("/:id", getsingleshop);
router.post("/add-shop", auth, addshop);
router.put("/update-shop/:id", auth, updateshop);
router.delete("/delete-shop/:id", auth, deleteshop);

module.exports = router;
