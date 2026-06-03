const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load backend .env
dotenv.config({ path: path.join(__dirname, "../backend-api/.env") });

const Product = require("../backend-api/models/Products");

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const products = await Product.find({
      $or: [
        { productSellingPrice: { $exists: false } },
        { productSellingPrice: null },
        { productMrpPrice: { $exists: false } },
        { productMrpPrice: null },
      ],
    });

    console.log(`Found ${products.length} products to migrate`);

    for (let product of products) {
      // If selling price is missing, use productPrice
      if (!product.productSellingPrice && product.productPrice) {
        product.productSellingPrice = product.productPrice;
      }
      // If MRP is missing, use productPrice as default (no discount)
      if (!product.productMrpPrice && product.productPrice) {
        product.productMrpPrice = product.productPrice;
      }

      await product.save();
      console.log(`Migrated: ${product.productName}`);
    }

    console.log("Migration complete");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
