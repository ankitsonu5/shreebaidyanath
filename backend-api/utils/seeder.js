const Collection = require("../models/Collections");
const Product = require("../models/Products");
const Consult = require("../models/consult");
const fs = require("fs");
const path = require("path");

const seedData = async () => {
  try {
    // 0. Ensure no unique index on email or mobile exists in consults collection (allows users to make multiple bookings)
    try {
      await Consult.collection.dropIndex("email_1");
      console.log("Dropped unique email index from consults collection successfully.");
    } catch (err) {
      if (err.codeName !== "IndexNotFound" && err.code !== 27) {
        console.log("Consults index drop note (email):", err.message);
      }
    }

    try {
      await Consult.collection.dropIndex("mobile_1");
      console.log("Dropped unique mobile index from consults collection successfully.");
    } catch (err) {
      if (err.codeName !== "IndexNotFound" && err.code !== 27) {
        console.log("Consults index drop note (mobile):", err.message);
      }
    }

    // 1. Ensure "Immunity Booster" collection exists
    let immunityCollection = await Collection.findOne({
      collectionName: { $regex: /^immunity booster$/i }
    });

    if (!immunityCollection) {
      console.log("Seeding 'Immunity Booster' collection...");
      const destDir = path.join(__dirname, "../uploads/collections");
      const destImg = path.join(destDir, "immunitybooster.webp");

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Check if image exists in public/shopbycolletions and copy it
      const sourceImg = path.join(__dirname, "../../public/shopbycolletions/immunitybooster.webp");
      if (fs.existsSync(sourceImg)) {
        fs.copyFileSync(sourceImg, destImg);
        console.log("Copied collection image to uploads/collections");
      }

      immunityCollection = new Collection({
        collectionName: "Immunity Booster",
        collectionImage: ["uploads/collections/immunitybooster.webp"],
      });
      await immunityCollection.save();
    }

    // 2. Ensure "Kumbhprash" product exists
    let kumbhprash = await Product.findOne({
      productName: { $regex: /^kumbhprash$/i }
    });

    if (!kumbhprash) {
      console.log("Seeding 'Kumbhprash' product...");
      kumbhprash = new Product({
        productName: "Kumbhprash",
        productDescription: "A premium Ayurvedic wellness formulation enriched with organic Kumbh honey, fresh Amla, and potent immunity-boosting herbs. It rejuvenates the body, enhances vitality, and strengthens the body's natural defense mechanism against seasonal infections.",
        productImage: ["uploads/products/kumbhprash.png"],
        productMrpPrice: 450,
        productSellingPrice: 399,
        productStock: 150,
        productCollection: immunityCollection._id,
        productTag: "bestseller"
      });
      await kumbhprash.save();
    }

    // 3. Ensure "Basant Kusumakar Ras" product exists
    let basant = await Product.findOne({
      productName: { $regex: /^(basant kusumakar ras|basnt kushumakar rash)$/i }
    });

    if (!basant) {
      console.log("Seeding 'Basant Kusumakar Ras' product...");
      basant = new Product({
        productName: "Basant Kusumakar Ras",
        productDescription: "A classical and highly potent Ayurvedic herbomineral medicine containing Swarna Bhasma (Gold), Rajat Bhasma (Silver), and Moti Bhasma (Pearl). Celebrated for its deep rejuvenating properties, it boosts immunity, enhances stamina, regulates sugar levels, and promotes overall longevity and vitality.",
        productImage: ["uploads/products/basant_kusumakar_ras.png"],
        productMrpPrice: 1250,
        productSellingPrice: 1100,
        productStock: 80,
        productCollection: immunityCollection._id,
        productTag: "popular"
      });
      await basant.save();
    }

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};

module.exports = seedData;
