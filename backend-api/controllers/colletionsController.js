const Collection = require("../models/Collections");

exports.createCollection = async (req, res) => {
  try {
    const { collectionName } = req.body;
    const collectionImage = req.file ? [req.file.path] : [];
    const createdBy = req.user.id;

    const collection = new Collection({
      collectionName,
      collectionImage,
      createdBy,
    });

    await collection.save();
    res.status(201).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCollection = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }
    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const id = req.params.id;
    const { collectionName } = req.body;
    const updateData = { collectionName };

    if (req.file) {
      updateData.collectionImage = [req.file.path];
    }

    const collection = await Collection.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }
    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);
    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
