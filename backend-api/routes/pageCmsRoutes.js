const express = require("express");
const router = express.Router();
const pageCmsController = require("../controllers/pageCmsController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { createUpload } = require("../middlewares/upload");

const upload = createUpload("cms");

router.get("/page-cms", pageCmsController.getAllPages);
router.get("/page-cms/:slug", pageCmsController.getPageBySlug);
router.put(
  "/page-cms/:slug",
  auth,
  admin,
  upload.single("bannerImage"),
  pageCmsController.updatePage
);

module.exports = router;
