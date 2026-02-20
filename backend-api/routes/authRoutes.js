const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/registerController");
const { userLogin } = require("../controllers/signinController");
const { forgotPassword, resetPassword } = require("../controllers/authControllers");

router.post("/signup", signup);
router.post("/signin", userLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
