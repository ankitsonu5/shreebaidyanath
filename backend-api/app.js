require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionsRoutes");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const blogRoutes = require("./routes/blogRoutes");
const consultRoutes = require("./routes/consultRoutes");
const contactRoutes = require("./routes/contactRoutes");
const commentRoutes = require("./routes/commentRoutes");

const path = require("path");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    const seedData = require("./utils/seeder");
    seedData();

    const server = app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Stop the process using it or set a different PORT in .env.`,
        );
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message || error);
    process.exit(1);
  });

app.use("/", authRoutes);
app.use("/", collectionRoutes);
app.use("/", productRoutes);
app.use("/", bannerRoutes);
app.use("/", userRoutes);
app.use("/", orderRoutes);
app.use("/", blogRoutes);
app.use("/", consultRoutes);
app.use("/", contactRoutes);
app.use("/", commentRoutes);
