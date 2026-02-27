const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser, getUserById } = require("../controllers/userController");

router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.delete("/users/:id", deleteUser);

module.exports = router;