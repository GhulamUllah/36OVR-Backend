const express = require("express");
const Category = require("../models/catageryModel");
const router = express.Router();
const {
  addcatagery,
  getallcatageries,
  getallcatagerieslist,
  getsinglecatagery,
  editcatagery,
  getcatagerybyid,
} = require("../Controllers/catageryController");
const { auth } = require("../middleware/auth");

router.post("/addcatagery", auth, addcatagery);
router.get("/", getallcatageries);
router.get("/list", getallcatagerieslist);
router.get("/:name", getsinglecatagery);
router.put("/:id", editcatagery);
router.get("/catagery/:id", getcatagerybyid);

module.exports = router;
