const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { createUpload } = require("../middlewares/upload");

const upload = createUpload("gallery");

router.post(
  "/gallery",
  auth,
  admin,
  upload.single("image"),
  galleryController.uploadImage
);

router.get("/gallery", galleryController.getGalleryImages);

router.delete("/gallery/:id", auth, admin, galleryController.deleteImage);

module.exports = router;
