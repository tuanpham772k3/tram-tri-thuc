const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Chỉ bắt buộc nếu không dùng Google OAuth
            },
        },
        avatar: { type: String, default: null },
        token: { type: String, default: null }, // Token để xác minh email, refresh token hoặc logout
        resetToken: { type: String, default: null },
        resetTokenExpires: { type: Date, default: null },
        role: { type: String, enum: ["admin", "uploader", "member"], default: "member" },
        isActive: { type: Boolean, default: true },
        emailVerified: { type: Boolean, default: false },
        verificationCode: { type: String, default: null },
        verificationCodeExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

userSchema.index({ resetTokenExpires: 1 }, { expireAfterSeconds: 0 });
userSchema.index({ verificationCodeExpires: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
