const mongoose = require("mongoose");

const pageCmsSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    pageName: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      set: function (val) {
        if (typeof val === "string") {
          return val.replace(/\\/g, "/");
        }
        return val;
      },
    },
    heroHeading: {
      type: String,
    },
    heroSubheading: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageCMS", pageCmsSchema);
