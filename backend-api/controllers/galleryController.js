const Gallery = require("../models/Gallery");

exports.uploadImage = async (req, res) => {
  try {
    const { title, mediaType, videoUrl } = req.body;
    let imagePath = "";

    if (req.file) {
      imagePath = req.file.path;
    } else if (mediaType === "video" && videoUrl) {
      imagePath = "video-link"; 
    } else {
      return res.status(400).json({ success: false, message: "No file or video URL uploaded" });
    }

    const gallery = new Gallery({
      image: imagePath,
      title: title || "",
      mediaType: mediaType || "photo",
      videoUrl: videoUrl || "",
      createdBy: req.user.id,
    });

    await gallery.save();
    res.status(201).json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
