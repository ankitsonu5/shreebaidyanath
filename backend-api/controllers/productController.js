const Product = require("../models/Products");
const Collection = require("../models/Collections");

exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productMrpPrice,
      productSellingPrice,
      productStock,
      productCollection,
      productTag,
    } = req.body;
    const productImage = req.files ? req.files.map((f) => f.path) : [];
    const createdBy = req.user.id;

    const product = new Product({
      productName,
      productDescription,
      productImage,
      productMrpPrice,
      productSellingPrice,
      productStock,
      productCollection: productCollection || undefined,
      productTag: productTag || null,
      createdBy,
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const { productCollection, productTag, search, sort } = req.query;
    let filter = {};

    if (productCollection) {
      filter.productCollection = productCollection;
    }
    if (productTag) {
      filter.productTag = productTag;
    }
    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }

    let sortOption = {};
    if (sort === "price_low") sortOption.productSellingPrice = 1;
    else if (sort === "price_high") sortOption.productSellingPrice = -1;
    else if (sort === "newest") sortOption._id = -1;

    const products = await Product.find(filter)
      .populate("productCollection", "collectionName")
      .sort(sortOption);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found " });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      productName,
      productDescription,
      productMrpPrice,
      productSellingPrice,
      productStock,
      productCollection,
      productTag,
    } = req.body;
    const updataData = {
      productName,
      productDescription,
      productMrpPrice,
      productSellingPrice,
      productStock,
      productCollection: productCollection || undefined,
      productTag: productTag || null,
    };

    if (req.files && req.files.length > 0) {
      updataData.productImage = req.files.map((f) => f.path);
    }

    const product = await Product.findByIdAndUpdate(id, updataData, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShopBySolutions = async (req, res) => {
  try {
    // Find collections matching "Pure Herbs" or "Herbal Juices" (case-insensitive & handles potential typos/variations)
    const collections = await Collection.find({
      collectionName: { $in: [/pure herbs/i, /hurb.*juice/i, /herbal.*juice/i] }
    });
    const collectionIds = collections.map(c => c._id);

    // Get products belonging to these collections OR tagged with "herbal"
    const products = await Product.find({
      $or: [
        { productCollection: { $in: collectionIds } },
        { productTag: "herbal" }
      ]
    }).populate("productCollection", "collectionName");

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(200).json({ success: true, products: [], collections: [] });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    // Fetch up to 5 matching products
    const products = await Product.find({ productName: { $regex: searchRegex } })
      .select("productName productImage productSellingPrice productPrice")
      .limit(5);

    // Fetch up to 5 matching collections
    const collections = await Collection.find({ collectionName: { $regex: searchRegex } })
      .select("collectionName collectionImage")
      .limit(5);

    res.status(200).json({
      success: true,
      products,
      collections,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
