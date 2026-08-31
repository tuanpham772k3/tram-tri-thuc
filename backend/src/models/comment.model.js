const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxLength: 500 },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Tối ưu query lấy bình luận
commentSchema.index({ documentId: 1, isReported: 1, isDeleted: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
