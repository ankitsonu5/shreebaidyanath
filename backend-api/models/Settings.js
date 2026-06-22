const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "Shree Baidyanath" },
  contactEmail: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
  contactAddress: { type: String, default: "" },
  facebookUrl: { type: String, default: "" },
  instagramUrl: { type: String, default: "" },
  twitterUrl: { type: String, default: "" },
  youtubeUrl: { type: String, default: "" },
  logo: { 
    type: String, 
    default: "",
    set: function (val) {
      if (typeof val === "string") {
        return val.replace(/\\/g, "/");
      }
      return val;
    }
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Settings", settingsSchema);
