const express = require("express");

const router = express.Router();
const {
  resentotp,
  signup,
  login,
  loaduser,
  passwordchange,
  resetpassword,
  resetpasswordlink,
  verifyuser,
  sellerverify,
  becomeaseller,
  emailverify,
  admin,
  getallusers,
  deleteuser,
} = require("../Controllers/userController");
const { auth } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/", auth, loaduser);
router.post("/passwordchange", auth, passwordchange);
router.post("/resetpasswordlink", resetpasswordlink);
router.post("/resetpassword/:otp", resetpassword);
router.post("/verify", verifyuser);
router.post("/resend-otp", resentotp);
router.post("/sellerphoneverify", sellerverify);

router.post("/becomeaseller", auth, becomeaseller);
router.post("/sellerconfirm", auth, emailverify);

router.get("/admin", admin);
router.get("/users", auth, getallusers);
router.delete("/user/:id", auth, deleteuser);

module.exports = router;
