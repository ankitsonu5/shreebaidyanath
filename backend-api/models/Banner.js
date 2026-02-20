const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    required: true,
  },
  bannerType: {
    type: String,
    enum: ["hero", "offer"],
    default: "hero",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  bannerOrder: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);
