const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createContact,
  getContacts,
  deleteContact,
  replyToContact,
} = require("../controllers/contactController");

router.post("/add-contact", createContact);
router.get("/contacts", auth, getContacts);
router.delete("/contact/:id", auth, deleteContact);
router.post("/contact/:id/reply", auth, replyToContact);

module.exports = router;
