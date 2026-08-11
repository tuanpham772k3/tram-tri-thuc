const express = require("express");
const router = express.Router();
const { commentLimiter } = require("../utils/rateLimit");
const {
    getRatingsByDocument,
    createOrUpdateRating,
    getAverageRating,
    deleteRating,
    getCommentsByDocument,
    createComment,
    updateComment,
    deleteComment,
    reportComment,
    getRatingDistribution,
} = require("../controller/ratingComment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Ratings: Lấy danh sách đánh giá của tài liệu
router.get("/ratings/:documentId", getRatingsByDocument);

// Ratings: Lấy điểm trung bình đánh giá
router.get("/ratings/:documentId/average", getAverageRating);

// Ratings: Lấy phân phối đánh giá
router.get("/ratings/:documentId/distribution", getRatingDistribution);

// Ratings: Tạo hoặc cập nhật đánh giá
router.post("/ratings/:documentId", authMiddleware, commentLimiter, createOrUpdateRating);

// Ratings: Xóa đánh giá
router.delete("/ratings/:documentId", authMiddleware, deleteRating);

// Comments: Lấy danh sách bình luận của tài liệu
router.get("/comments/:documentId", getCommentsByDocument);

// Comments: Tạo bình luận
router.post("/comments/:documentId", authMiddleware, commentLimiter, createComment);

// Comments: Cập nhật bình luận
router.put("/comments/:commentId", authMiddleware, commentLimiter, updateComment);

// Comments: Xóa bình luận
router.delete("/comments/:commentId", authMiddleware, deleteComment);

// Comments: Báo cáo bình luận vi phạm
router.post("/comments/:commentId/report", authMiddleware, commentLimiter, reportComment);

module.exports = router;
