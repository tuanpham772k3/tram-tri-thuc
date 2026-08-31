const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
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
    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "uploader", "member"],
      default: "member",
    },
    isActive: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },

    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },

    isVip: {
      type: String,
      enum: ["not_activated", "active", "expired"],
      default: "not_activated",
    },
    vipStartDate: {
      type: Date,
      default: null,
    },
    vipEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ passwordResetTokenExpires: 1 }, { expireAfterSeconds: 0 });
userSchema.index({ verificationCodeExpires: 1 }, { expireAfterSeconds: 0 });
// Thêm index cho vipEndDate để hỗ trợ kiểm tra hết hạn VIP
userSchema.index({ vipEndDate: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
