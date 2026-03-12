const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    author: {
        type: String,
        default: "Shree Baidyanath"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);