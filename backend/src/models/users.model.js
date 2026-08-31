const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email không đúng định dạng",
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLength: 50,
    },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
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

usersSchema.index({ passwordResetTokenExpires: 1 }, { expireAfterSeconds: 0 });
usersSchema.index({ verificationCodeExpires: 1 }, { expireAfterSeconds: 0 });
usersSchema.index({ vipEndDate: 1 }, { expireAfterSeconds: 0 });

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
