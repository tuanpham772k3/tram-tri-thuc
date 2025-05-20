const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, // Tiêu đề tài liệu
    description: { type: String, required: false }, // Mô tả tài liệu
    fileUrl: { type: String, required: true }, // URL của file
    fileName: { type: String }, // Tên file gốc (hiển thị UI)
    mimeType: { type: String, required: true }, // Loại MIME của file
    format: { type: String }, // "pdf", "docx", "pptx", dùng cho filter
    size: { type: Number, required: true }, // Kích thước file
    slug: { type: String, required: true, unique: true },

    thumbnailUrl: { type: String }, // URL ảnh đại diện tài liệu (nếu có)
    tags: [{ type: String }], // Từ khoá liên quan

    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người tải lên
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false }, // Danh mục tài liệu

    isPublic: { type: Boolean, default: true }, // Có chia sẻ public
    isApproved: { type: Boolean, default: false }, // Trạng thái phê duyệt
    isFeatured: { type: Boolean, default: false }, // Đánh dấu nổi bật

    viewCount: { type: Number, default: 0 }, // Số lượt xem
    downloadCount: { type: Number, default: 0 }, // Số lượt tải xuống

    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật
});

DocumentSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Index hỗ trợ tìm kiếm, lọc, sắp xếp
DocumentSchema.index({ title: "text", description: "text", tags: "text" });
DocumentSchema.index({ uploaderId: 1 });
DocumentSchema.index({ categoryId: 1 });
DocumentSchema.index({ isApproved: 1 });
DocumentSchema.index({ isFeatured: 1 });
DocumentSchema.index({ viewCount: -1 });
DocumentSchema.index({ downloadCount: -1 });
DocumentSchema.index({ createdAt: -1 });

const Document = mongoose.models.Document || mongoose.model("Document", DocumentSchema);

module.exports = Document;
