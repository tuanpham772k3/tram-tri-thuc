const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, // Tiêu đề tài liệu
    description: { type: String, required: false }, // Mô tả tài liệu
    fileUrl: { type: String, required: true }, // URL của file
    mimeType: { type: String, required: true }, // Loại MIME của file
    size: { type: Number, required: true }, // Kích thước file
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người tải lên
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false }, // Danh mục tài liệu
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật
    isApproved: { type: Boolean, default: false }, // Trạng thái phê duyệt
    isFeatured: { type: Boolean, default: false }, // Đánh dấu nổi bật
    viewCount: { type: Number, default: 0 }, // Số lượt xem
    downloadCount: { type: Number, default: 0 }, // Số lượt tải xuống
    tags: { type: [String], required: false }, // Thẻ liên quan đến tài liệu
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người đánh giá
            stars: { type: Number, required: true }, // Số sao đánh giá
            comment: { type: String, required: false }, // Bình luận
            createdAt: { type: Date, default: Date.now }, // Ngày đánh giá
        },
    ],
});

// Thêm index để tối ưu hóa truy vấn
DocumentSchema.index({ uploaderId: 1 });
DocumentSchema.index({ categoryId: 1 });
DocumentSchema.index({ isApproved: 1 });
DocumentSchema.index({ isFeatured: 1 });
DocumentSchema.index({ viewCount: -1 });
DocumentSchema.index({ downloadCount: -1 });
DocumentSchema.index({ tags: 1 });

const Document = mongoose.models.Document || mongoose.model("Document", DocumentSchema);

module.exports = Document