const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createUpload } = require("../middlewares/upload");
const upload = createUpload("banners");
const {
  createBanner,
  getAllBanners,
  getAllBannersAdmin,
  getBannerById,
  updateBanner,
  toggleBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.post("/add-banner", auth, upload.single("bannerImage"), createBanner);
router.get("/banners", getAllBanners);
router.get("/banners/admin", auth, getAllBannersAdmin);
router.get("/banner/:id", getBannerById);
router.put("/banner/:id", auth, upload.single("bannerImage"), updateBanner);
router.patch("/banner/:id/toggle", auth, toggleBanner);
router.delete("/banner/:id", auth, deleteBanner);

module.exports = router;
