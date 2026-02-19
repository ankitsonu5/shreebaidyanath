const mongoose = require("mongoose");
const User = require("./backend-api/models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend-api/.env" });

async function testRegister() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to DB");

    const testEmail = `test_${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log("Attempting to save user...");
    const user = new User({
      name: "Test User",
      email: testEmail,
      password: hashedPassword,
    });

    await user.save();
    console.log("SUCCESS: User saved to DB:", testEmail);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("FAILURE:", error.message);
    process.exit(1);
  }
}

testRegister();
