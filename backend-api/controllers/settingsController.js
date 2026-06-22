const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const {
      siteName,
      contactEmail,
      contactPhone,
      contactAddress,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      youtubeUrl,
    } = req.body;

    if (siteName !== undefined) settings.siteName = siteName;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactAddress !== undefined) settings.contactAddress = contactAddress;
    if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
    if (twitterUrl !== undefined) settings.twitterUrl = twitterUrl;
    if (youtubeUrl !== undefined) settings.youtubeUrl = youtubeUrl;

    if (req.file) {
      settings.logo = req.file.path;
    }

    settings.updatedAt = Date.now();
    await settings.save();

    res.json({ success: true, settings, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Failed to update settings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
