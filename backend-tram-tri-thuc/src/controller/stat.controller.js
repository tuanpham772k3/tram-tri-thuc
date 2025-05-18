const Document = require("../models/Document.model");
const User = require("../models/User.model");
const Rating = require("../models/Rating.model");
const Comment = require("../models/Comments.model");

// Tổng quan hệ thống
exports.getOverview = async (req, res) => {
    try {
        const totalDocuments = await Document.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRatings = await Rating.countDocuments();
        const totalComments = await Comment.countDocuments();

        res.json({
            totalDocuments,
            totalUsers,
            totalRatings,
            totalComments,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Top tài liệu (ví dụ: theo số lượt đánh giá cao nhất)
exports.getTopDocuments = async (req, res) => {
    try {
        // Lấy top 5 tài liệu có điểm trung bình đánh giá cao nhất
        const topDocuments = await Rating.aggregate([
            {
                $group: {
                    _id: "$document",
                    avgStars: { $avg: "$stars" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { avgStars: -1, count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "documents",
                    localField: "_id",
                    foreignField: "_id",
                    as: "document",
                },
            },
            { $unwind: "$document" },
        ]);

        res.json({ topDocuments });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Người dùng nổi bật (ví dụ: nhiều đánh giá hoặc bình luận nhất)
exports.getTopUsers = async (req, res) => {
    try {
        // Lấy top 5 user có nhiều đánh giá nhất
        const topUsers = await Rating.aggregate([
            {
                $group: {
                    _id: "$user",
                    ratingCount: { $sum: 1 },
                },
            },
            { $sort: { ratingCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
        ]);

        res.json({ topUsers });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
