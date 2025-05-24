const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true }, // Tham chiếu đến tài liệu
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng
        content: { type: String, required: true }, // Nội dung bình luận
        isDeleted: { type: Boolean, default: false }, // Trạng thái xóa
        isApproved: { type: Boolean, default: false }, // Trạng thái phê duyệt bình luận
        parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", required: false }, // ID bình luận cha (nếu có)
    },
    { timestamps: true }
);

// Tối ưu query lấy bình luận
commentSchema.index({ documentId: 1, isApproved: 1, isDeleted: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
