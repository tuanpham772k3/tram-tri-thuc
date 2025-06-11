const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        //thông tin
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["admin", "uploader", "member"], default: "member" },
        avatar: { type: String, default: null },
        phone: { type: String, default: null },
        address: { type: String, default: null },
        country: { type: String, default: null },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Chỉ bắt buộc nếu không dùng Google OAuth
            },
        },
        //token
        token: { type: String, default: null }, // Token để xác minh email, refresh token hoặc logout
        resetToken: { type: String, default: null },
        resetTokenExpires: { type: Date, default: null },
        //xác thực email
        emailVerified: { type: Boolean, default: false },
        verificationCode: { type: String, default: null },
        verificationCodeExpires: { type: Date, default: null },
        //trạng thái
        isActive: { type: Boolean, default: true },
        isVip: {
            type: String,
            enum: ["not_activated", "active", "expired"],
            default: "not_activated",
        }, // Trạng thái VIP
        vipStartDate: { type: Date, default: null }, // Thời gian bắt đầu VIP
        vipEndDate: { type: Date, default: null }, // Thời gian hết hạn VIP
    },
    { timestamps: true }
);

userSchema.index({ resetTokenExpires: 1 }, { expireAfterSeconds: 0 });
userSchema.index({ verificationCodeExpires: 1 }, { expireAfterSeconds: 0 });
// Thêm index cho vipEndDate để hỗ trợ kiểm tra hết hạn VIP
userSchema.index({ vipEndDate: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
