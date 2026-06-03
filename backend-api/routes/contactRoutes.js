const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createContact,
  getContacts,
  deleteContact,
} = require("../controllers/contactController");

router.post("/add-contact", createContact);
router.get("/contacts", auth, getContacts);
router.delete("/contact/:id", auth, deleteContact);

module.exports = router;
