const mongoose = require("mongoose");
const { Schema } = mongoose;

const RatingSchema = new Schema(
    {
        documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true }, // Tham chiếu đến tài liệu
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng
        stars: { type: Number, required: true, min: 1, max: 5 }, // Số sao (1 đến 5)
    },
    {
        timestamps: true, // Tự động thêm trường createdAt và updatedAt
    }
);

// Đảm bảo mỗi user chỉ đánh giá một lần cho mỗi tài liệu
RatingSchema.index({ userId: 1, documentId: 1 }, { unique: true });

// Tạo model Rating
const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);

module.exports = Rating;
