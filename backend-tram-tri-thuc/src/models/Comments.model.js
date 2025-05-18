const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true }, // Tham chiếu đến tài liệu
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng
    content: { type: String, required: true }, // Nội dung bình luận
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    isDeleted: { type: Boolean, default: false }, // Trạng thái xóa
    isApproved: { type: Boolean, default: false }, // Trạng thái phê duyệt bình luận
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", required: false }, // ID bình luận cha (nếu có)
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
