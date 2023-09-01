const express = require("express");

const router = express.Router();
const {
  addbrand,
  brandlist,
  deletebrand,
  updatebrand,
} = require("../Controllers/brandContrller");

const { auth } = require("../middleware/auth");

router.post("/", auth, addbrand);
router.get("/", auth, brandlist);
router.put("/:id", auth, updatebrand);
router.delete("/:id", auth, deletebrand);

module.exports = router;
