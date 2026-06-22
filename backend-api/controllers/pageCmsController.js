const PageCMS = require("../models/PageCMS");

exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageCMS.find({});
    res.status(200).json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await PageCMS.findOne({ slug });
    
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    res.status(200).json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { pageName, heroHeading, heroSubheading } = req.body;
    
    let updateData = {
      heroHeading,
      heroSubheading,
    };
    
    // Only update pageName if provided, though slug stays same
    if (pageName) updateData.pageName = pageName;
    
    if (req.file) {
      updateData.bannerImage = req.file.path;
    }

    // Try to update existing or create if it doesn't exist (upsert)
    let page = await PageCMS.findOne({ slug });
    
    if (page) {
      page = await PageCMS.findOneAndUpdate(
        { slug },
        { $set: updateData },
        { new: true }
      );
    } else {
      // Create new if it didn't exist
      updateData.slug = slug;
      if (!updateData.pageName) updateData.pageName = slug; // Fallback
      page = new PageCMS(updateData);
      await page.save();
    }

    res.status(200).json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
