const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createUpload } = require("../middlewares/upload");
const upload = createUpload("products");
const {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getShopBySolutions,
  getSearchSuggestions,
} = require("../controllers/productController");

router.post("/add-product", auth, upload.array("productImage", 10), createProduct);
router.get("/products", getAllProduct);
router.get("/shop-by-solutions", getShopBySolutions);
router.get("/search/suggest", getSearchSuggestions);
router.get("/product/:id", getProductById);
router.put("/product/:id", auth, upload.array("productImage", 10), updateProduct);
router.delete("/product/:id", auth, deleteProduct);

module.exports = router;
