const Banner = require("../models/Banner");

exports.createBanner = async (req, res) => {
  try {
    const bannerImage = req.file ? req.file.path : "";
    const { bannerType, bannerOrder } = req.body;
    const createdBy = req.user.id;

    const banner = new Banner({
      bannerImage,
      bannerType: bannerType || "hero",
      bannerOrder: bannerOrder || 0,
      createdBy,
    });

    await banner.save();
    res.status(201).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public — only active banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      bannerOrder: 1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin — ALL banners (active + inactive)
exports.getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({
      bannerOrder: 1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { bannerType, bannerOrder, isActive } = req.body;
    const updateData = {};

    if (bannerType !== undefined) updateData.bannerType = bannerType;
    if (bannerOrder !== undefined) updateData.bannerOrder = bannerOrder;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (req.file) updateData.bannerImage = req.file.path;

    const banner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle active/inactive
exports.toggleBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    banner.isActive = !banner.isActive;
    await banner.save();
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    res.status(200).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
