const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/registerController");
const { userLogin } = require("../controllers/signinController");

router.post("/signup", signup);
router.post("/signin", userLogin);

module.exports = router;
