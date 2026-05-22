const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createConsult, getConsultations, deleteConsultation } = require("../controllers/consultController");

router.post("/add-consult", createConsult);
router.get("/consultations", auth, getConsultations);
router.delete("/consultation/:id", auth, deleteConsultation);

module.exports = router;