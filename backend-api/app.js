require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cors());
connectDB();

app.use("/", authRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${process.env.PORT || 8080}`);
});