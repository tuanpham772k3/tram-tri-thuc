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
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
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

        // Token để xác minh email, refresh token hoặc logout
        token: {
            type: String,
            default: null,
        },

        // Reset mật khẩu
        resetToken: {
            type: String,
            default: null,
        },
        
        resetTokenExpires: {
            type: Date,
            default: null,
        },

        role: {
            type: String,
            enum: ["admin", "uploader", "member"],
            default: "member",
        },

        // Trạng thái hoạt động
        isActive: {
            type: Boolean,
            default: true,
        },

        favoriteDocuments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],

        recentViews: [
            {
                documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
                viewedAt: { type: Date, default: Date.now },
            },
        ],

        downloadHistory: [
            {
                documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
                downloadedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

userSchema.index({ resetTokenExpires: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
