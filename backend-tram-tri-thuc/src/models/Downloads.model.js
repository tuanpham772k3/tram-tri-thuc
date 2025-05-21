const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true,
        },
        downloadedAt: {
            type: Date,
            required: true,
        },
        ipAddress: {
            type: String,
        },
        deviceInfo: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Download", downloadSchema);
