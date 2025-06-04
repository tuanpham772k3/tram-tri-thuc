const Comment = require("../models/comment.model");
const logger = require("../utils/logger");
const { getPagingData, getPagination } = require("../utils/paginate");

// Admin: Lấy toàn bộ bình luận
exports.getAllComments = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const { isReported } = req.query;

        const matchConditions = {};
        if (isReported !== undefined) matchConditions.isReported = isReported === "true";

        const comments = await Comment.find(matchConditions)
            .populate("userId", "name email")
            .populate("documentId", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Comment.countDocuments(matchConditions);
        const pagingData = getPagingData(comments, total, page, limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error(`Get all comments error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách bình luận.",
        });
    }
};

// Admin: Xóa cứng bình luận vi phạm
exports.forceDeleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Bình luận không tồn tại hoặc đã bị xóa.",
            });
        }

        // Xóa bình luận chính và tất cả replies
        await Comment.deleteMany({
            $or: [{ _id: commentId }, { parentCommentId: commentId }],
        });

        logger.info(`Comment ${commentId} and its replies hard deleted by admin ${req.user.email}`);
        res.status(200).json({
            success: true,
            message: "Xóa bình luận và các replies thành công.",
        });
    } catch (error) {
        logger.error(`Force delete comment error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể xóa bình luận.",
        });
    }
};
