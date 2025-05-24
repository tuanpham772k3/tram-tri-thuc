const Rating = require("../models/rating.model");
const Comment = require("../models/comment.model");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const logger = require("../utils/logger");
const { getPagination, getPagingData } = require("../utils/paginate");
const { notifyDocumentOwner } = require("../utils/notification");

// Tạo mới đánh giá
exports.createRating = async (req, res) => {
    try {
        const { documentId, stars } = req.body;

        const document = await Document.findById(documentId);
        if (!document || document.status !== "approved") {
            return res.status(404).json({
                success: false,
                message: "Tài liệu không tồn tại hoặc chưa được duyệt.",
            });
        }

        let rating = await Rating.findOne({ userId: req.user._id, documentId });
        if (rating) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đánh giá tài liệu này. Sử dụng PUT để cập nhật.",
            });
        }

        rating = new Rating({ userId: req.user._id, documentId, stars });
        await rating.save();

        // Gửi thông báo đến chủ sở hữu
        const user = await User.findById(req.user._id).select("name");
        await notifyDocumentOwner({
            documentId,
            actionUserId: req.user._id,
            type: "new_rating",
            actionUserName: user.name || req.user.email,
        });

        logger.info(`Rating created by ${req.user.email} for document ${documentId}`);
        res.status(201).json({
            success: true,
            message: "Đánh giá thành công.",
            data: rating,
        });
    } catch (error) {
        logger.error(`Create rating error: ${error.message}`);
        res.status(500).json({ success: false, message: "Không thể gửi đánh giá." });
    }
};

// Cập nhật đánh giá
exports.updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { stars } = req.body;
        const isAdmin = req.user.role === "admin";

        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: "Đánh giá không tồn tại.",
            });
        }

        if (!isAdmin && rating.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền cập nhật đánh giá này.",
            });
        }

        rating.stars = stars;
        rating.updatedAt = new Date();
        await rating.save();

        logger.info(`Rating updated by ${req.user.email} for rating ${id}`);
        res.status(200).json({
            success: true,
            message: "Cập nhật đánh giá thành công.",
            data: rating,
        });
    } catch (error) {
        logger.error(`Update rating error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể cập nhật đánh giá.",
        });
    }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
    try {
        const { id } = req.params;

        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: "Đánh giá không tồn tại.",
            });
        }

        await rating.deleteOne();
        logger.info(`Rating deleted by admin ${req.user.email} for rating ${id}`);
        res.status(200).json({
            success: true,
            message: "Xóa đánh giá thành công.",
        });
    } catch (error) {
        logger.error(`Delete rating error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể xóa đánh giá.",
        });
    }
};

// Lấy danh sách đánh giá của tài liệu
exports.getRatingsByDocument = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const { page, limit, skip } = getPagination(req.query);

        const ratings = await Rating.find({ documentId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Rating.countDocuments({ documentId });
        const pagingData = getPagingData(ratings, total, page, limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error(`Get ratings error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách đánh giá.",
        });
    }
};

// Tạo mới bình luận
exports.createComment = async (req, res) => {
    try {
        const { documentId, content, parentCommentId } = req.body;

        const document = await Document.findById(documentId);
        if (!document || document.status !== "approved") {
            return res.status(404).json({
                success: false,
                message: "Tài liệu không tồn tại hoặc chưa được duyệt.",
            });
        }

        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment || parentComment.isDeleted || !parentComment.isApproved) {
                return res.status(404).json({
                    success: false,
                    message: "Bình luận cha không tồn tại, đã bị xóa hoặc chưa được duyệt.",
                });
            }
            if (parentComment.documentId.toString() !== documentId) {
                return res.status(400).json({
                    success: false,
                    message: "Bình luận cha không thuộc tài liệu này.",
                });
            }
        }

        const comment = new Comment({
            userId: req.user._id,
            documentId,
            content,
            parentCommentId: parentCommentId || null,
            isApproved: req.user.role === "admin",
        });
        await comment.save();

        // Gửi thông báo đến chủ sở hữu
        const user = await User.findById(req.user._id).select("name");
        await notifyDocumentOwner({
            documentId,
            actionUserId: req.user._id,
            type: "new_comment",
            actionUserName: user.name || req.user.email,
        });

        logger.info(`Comment created by ${req.user.email} for document ${documentId}`);
        res.status(201).json({
            success: true,
            message: "Bình luận thành công.",
            data: comment,
        });
    } catch (error) {
        logger.error(`Create comment error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể gửi bình luận.",
        });
    }
};

// Lấy danh sách bình luận của tài liệu
exports.getCommentsByDocument = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const { page, limit, skip } = getPagination(req.query);

        const comments = await Comment.find({
            documentId,
            isApproved: true,
            isDeleted: false,
        })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Comment.countDocuments({
            documentId,
            isApproved: true,
            isDeleted: false,
        });
        const pagingData = getPagingData(comments, total, page, limit);

        res.status(200).json({ success: true, data: pagingData });
    } catch (error) {
        logger.error(`Get comments error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách bình luận.",
        });
    }
};

// Cập nhật bình luận
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const isAdmin = req.user.role === "admin";

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Bình luận không tồn tại.",
            });
        }

        if (comment.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Bình luận đã bị xóa, không thể cập nhật.",
            });
        }

        if (!isAdmin && comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền cập nhật bình luận này.",
            });
        }

        comment.content = content;
        comment.updatedAt = new Date();
        comment.isApproved = isAdmin; // Reset isApproved nếu user thường cập nhật
        await comment.save();

        logger.info(`Comment updated by ${req.user.email} for comment ${id}`);
        res.status(200).json({
            success: true,
            message: "Cập nhật bình luận thành công.",
            data: comment,
        });
    } catch (error) {
        logger.error(`Update comment error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể cập nhật bình luận.",
        });
    }
};

// Xóa bình luận
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === "admin";

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Bình luận không tồn tại.",
            });
        }

        if (!isAdmin && comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xóa bình luận này.",
            });
        }

        comment.isDeleted = true;
        await comment.save();
        logger.info(`Comment deleted by ${req.user.email} for comment ${id}`);
        res.status(200).json({
            success: true,
            message: "Xóa bình luận thành công.",
        });
    } catch (error) {
        logger.error(`Delete comment error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể xóa bình luận.",
        });
    }
};
