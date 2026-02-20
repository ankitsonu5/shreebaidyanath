const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/add-product", auth, upload.single("productImage"), createProduct);
router.get("/products", getAllProduct);
router.get("/product/:id", getProductById);
router.put("/product/:id", auth, upload.single("productImage"), updateProduct);
router.delete("/product/:id", auth, deleteProduct);

module.exports = router;
