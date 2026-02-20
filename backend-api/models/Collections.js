const mongoose = require("mongoose");

const collectionsSchema = new mongoose.Schema({
    collectionName: {
        type: String,
        required: true,
        unique: true
    },
    collectionImage: [
        {
            type: String,
            required: true
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},    
    createdAt: { type:Date, default: Date.now}
});

module.exports = mongoose.model("Collection", collectionsSchema);