const mongoose = require("mongoose");
require("dotenv").config({ path: "../backend-api/.env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shreebaidyanath";

async function checkDb() {
  try {
    console.log("Connecting to:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Fetch all collections in database
    const db = mongoose.connection.db;
    const collectionsList = await db.listCollections().toArray();
    console.log("Database collections:", collectionsList.map(c => c.name));

    // Get Collections data
    try {
      const CollectionSchema = new mongoose.Schema({}, { strict: false });
      const DBCollection = mongoose.model("Collection", CollectionSchema, "collections");
      const cols = await DBCollection.find({});
      console.log("\nSaved Collections:", cols.map(c => ({ id: c._id, name: c.collectionName || c.name })));
    } catch (e) {
      console.log("Error querying collections:", e.message);
    }

    // Get Products data
    try {
      const ProductSchema = new mongoose.Schema({}, { strict: false });
      const DBProduct = mongoose.model("Product", ProductSchema, "products");
      const totalCount = await DBProduct.countDocuments({});
      console.log("\nTotal Products Count:", totalCount);

      const tags = await DBProduct.distinct("productTag");
      console.log("Product Tags in DB:", tags);

      // Print counts per tag
      for (const tag of tags) {
        const count = await DBProduct.countDocuments({ productTag: tag });
        console.log(`- Products with tag "${tag}": ${count}`);
      }

      // Print collections referenced by products
      const productCollections = await DBProduct.distinct("productCollection");
      console.log("Product Collections referenced in DB:", productCollections);
    } catch (e) {
      console.log("Error querying products:", e.message);
    }

  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDb();
