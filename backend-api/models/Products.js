const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
  },
  productImage: [
    {
      type: String,
      required: true,
    },
  ],
  productPrice: {
    type: Number,
    required: true,
  },
  productStock: {
    type: Number,
    required: true,
    default: 0,
  },
  productCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
  },
  productTag: {
    type: String,
    enum: ["deal", "bestseller", "new", "popular", "herbal"],
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("Product", productSchema);
