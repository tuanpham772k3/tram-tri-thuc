const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const DocumentSchema = new mongoose.Schema({
    // Hỗ trọ tên loại tài liệu
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["file", "folder"],
        required: true,
    },
    // Thêm trường mimeType để lưu định dạng file
    mimeType: {
        type: String,
        required: function () {
            return this.type === "file";
        },
    },

    //Hỗ trợ cấu trúc cây (folders/files lồng nhau).
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        default: null, // null = thư mục gốc
    },

    //Liên kết với người dùng và Google Drive.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driveId: {
        type: String,
        required: true,
    },

    url: {
        type: String,
        required: function () {
            return this.type === "file";
        },
    },
    directUrl: {
        type: String,
        required: function () {
            return this.type === "file";
        },
    },

    size: {
        type: Number,
        required: function () {
            return this.type === "file";
        },
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },

    // Quản lý đánh dấu sao và thùng rác.
    starred: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    path: {
        type: String,
        default: "Root",
    },

    // Quản lý quyền truy cập và chia sẻ tài liệu.
    share: {
        linkId: {
            type: String,
            default: () => require("uuid").v4(),
        },
        secretKey: {
            type: String,
            default: () => require("crypto").randomBytes(3).toString("hex"), // 6 ký tự ngẫu nhiên
        },
        linkPermission: {
            type: String,
            enum: ["viewer", "editor", null],
            default: null,
        },
        expiryDate: {
            type: Date,
        },
        previewUrl: {
            type: String,
        },
        sharedWith: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: false,
                },
                email: {
                    type: String,
                    required: function () {
                        return !this.userId;
                    },
                    validate: {
                        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                        message: (props) => `${props.value} is not a valid email!`,
                    },
                },
                permission: {
                    type: String,
                    enum: ["viewer", "editor"],
                    required: true,
                },
                permissionId: {
                    type: String, // Lưu ID quyền từ Google Drive
                    required: true,
                },
            },
        ],
    },
});

module.exports = mongoose.model("Document", DocumentSchema);
