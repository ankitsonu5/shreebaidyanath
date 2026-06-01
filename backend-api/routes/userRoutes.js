const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { getAllUsers, deleteUser, getUserById, getMe, updateMe } = require("../controllers/userController");

router.get("/users", getAllUsers);
router.get("/user/me", auth, getMe);
router.put("/user/update", auth, updateMe);
router.get("/user/:id", getUserById);
router.delete("/users/:id", deleteUser);

module.exports = router;