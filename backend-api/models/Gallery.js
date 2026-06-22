const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
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
  title: {
    type: String,
    default: "",
  },
  mediaType: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo',
  },
  videoUrl: {
    type: String,
    default: "",
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

module.exports = mongoose.model("Gallery", gallerySchema);
