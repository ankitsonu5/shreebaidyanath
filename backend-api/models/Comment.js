const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    comment: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Auto-approve comments by default for standard organic interaction, can be moderated/deleted by admin
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
