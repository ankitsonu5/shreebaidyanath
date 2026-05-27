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
            required: true,
            set: function(val) {
                if (typeof val === 'string') {
                    return val.replace(/\\/g, '/');
                }
                return val;
            }
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},    
    createdAt: { type:Date, default: Date.now}
});

module.exports = mongoose.model("Collection", collectionsSchema);