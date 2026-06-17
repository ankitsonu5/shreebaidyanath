const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      set: function (val) {
        if (typeof val === "string") {
          return val.replace(/\\/g, "/");
        }
        return val;
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      default: "General Wellness",
    },
    author: {
      type: String,
      default: "Shree Baidyanath",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
