const express = require("express");

const router = express.Router();
const {
  createprofile,
  updateprofile,
  deleteprofile,
  getprofile,
} = require("../Controllers/profileController");

const { auth } = require("../middleware/auth");

router.post("/", auth, createprofile);
router.get("/", auth, getprofile);
router.put("/update-profile/:id", auth, updateprofile);
router.delete("/delete-profile/:id", auth, deleteprofile);

module.exports = router;
