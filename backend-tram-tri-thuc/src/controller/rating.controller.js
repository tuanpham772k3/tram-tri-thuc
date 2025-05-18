const Rating = require("../models/Rating.model");
const mongoose = require("mongoose");

// Thêm đánh giá (chấm sao)
exports.addRating = async (req, res) => {
    try {
        const { documentId, stars, comment } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({ message: "ID tài liệu không hợp lệ." });
        }

        // Kiểm tra nếu user đã đánh giá tài liệu này
        const existing = await Rating.findOne({ document: documentId, user: userId });
        if (existing) {
            return res.status(400).json({ message: "Bạn đã đánh giá tài liệu này." });
        }

        const rating = new Rating({
            document: documentId,
            user: userId,
            stars,
            comment,
        });

        await rating.save();
        res.status(201).json({ message: "Đã thêm đánh giá.", rating });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Lấy đánh giá theo tài liệu
exports.getRatingsByDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({ message: "ID tài liệu không hợp lệ." });
        }

        const ratings = await Rating.find({ document: documentId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({ ratings });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Cập nhật đánh giá
exports.updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { stars, comment } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ." });
        }

        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({ message: "Đánh giá không tồn tại." });
        }

        if (rating.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền sửa đánh giá này." });
        }

        rating.stars = stars !== undefined ? stars : rating.stars;
        rating.comment = comment !== undefined ? comment : rating.comment;

        await rating.save();
        res.json({ message: "Đã cập nhật đánh giá.", rating });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ." });
        }

        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({ message: "Đánh giá không tồn tại." });
        }

        if (rating.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa đánh giá này." });
        }

        await rating.deleteOne();
        res.json({ message: "Đã xóa đánh giá." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
