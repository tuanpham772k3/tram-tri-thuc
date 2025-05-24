const mongoose = require("mongoose");
const { Schema } = mongoose;

const shareSchema = new Schema(
    {
        documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true }, // Tham chiếu đến tài liệu
        sharedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người chia sẻ (uploader)
        sharedWithUserId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // Người dùng được chia sẻ (tùy chọn)
        linkId: { type: String, required: true }, // UUID của link chia sẻ
        permission: { type: String, enum: ["view", "edit"], required: true }, // Quyền chia sẻ ('view' hoặc 'edit')
        secretKey: { type: String, required: false }, // Khóa bí mật (tùy chọn)
        expiresAt: { type: Date, required: false }, // Ngày hết hạn (tùy chọn)
    },
    {
        timestamps: true, // Tự động thêm trường createdAt và updatedAt
    }
);

const Share = mongoose.model("Share", shareSchema);

module.exports = Share;
