const Product = require("../models/Products");

exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      productStock,
      productCollection,
      productTag,
    } = req.body;
    const productImage = req.file ? [req.file.path] : [];
    const createdBy = req.user.id;

    const product = new Product({
      productName,
      productDescription,
      productImage,
      productPrice,
      productStock,
      productCollection,
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
    const products = await Product.find();
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
      productPrice,
      productStock,
      productCollection,
      productTag,
    } = req.body;
    const updataData = {
      productName,
      productDescription,
      productPrice,
      productStock,
      productCollection,
      productTag: productTag || null,
    };

    if (req.file) {
      updataData.productImage = [req.file.path];
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
