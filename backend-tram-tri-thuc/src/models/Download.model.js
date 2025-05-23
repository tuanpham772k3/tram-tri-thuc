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
            default: Date.now,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        deviceInfo: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,

        indexes: [{ key: { userId: 1, documentId: 1 } }, { key: { downloadedAt: -1 } }],
    }
);

module.exports = mongoose.model("Download", downloadSchema);
