const mongoose = require("mongoose");
const { Schema } = mongoose;

const RatingSchema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true }, // Tham chiếu đến tài liệu
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng
    stars: { type: Number, required: true, min: 1, max: 5 }, // Số sao (1 đến 5)
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật
});

// Tạo model Rating
const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);

module.exports = Rating;
