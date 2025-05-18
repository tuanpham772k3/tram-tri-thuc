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

        googleId: {
            type: String,
            unique: true,
            sparse: true, // Cho phép null nhưng vẫn unique
        },

        // Thêm trường cho xác thực email
        isEmailVerified: { type: Boolean, default: false },
        // Thêm trường cho xác thực mật khẩu quên
        resetToken: { type: String, default: null },
        resetTokenExpires: { type: Date, default: null },
        // Thêm trường cho xác thực email
        emailVerificationToken: { type: String, default: null },
        emailVerificationTokenExpires: { type: Date, default: null },

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

        favoriteDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }], // Danh sách tài liệu yêu thích
        
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
