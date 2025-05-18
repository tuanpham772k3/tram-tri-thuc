const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    token: {
        type: String,
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }, // Tự động xóa khi hết hạn
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index để tối ưu tìm kiếm
refreshTokenSchema.index({ userId: 1, token: 1, expiresAt: 1 }, { unique: true });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
