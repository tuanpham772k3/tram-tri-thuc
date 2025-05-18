const mongoose = require("mongoose");
const { Schema } = mongoose;

const DownloadSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    downloadedAt: { type: Date, default: Date.now },
    ipAddress: { type: String, required: false },
});

const Download = mongoose.model("Download", DownloadSchema);

module.exports = Download;
