const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { createUpload } = require("../middlewares/upload");

const upload = createUpload("settings");

router.get("/settings", settingsController.getSettings);
router.put(
  "/settings",
  auth,
  admin,
  upload.single("logo"),
  settingsController.updateSettings
);

module.exports = router;
