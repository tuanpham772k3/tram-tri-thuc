const express = require("express");
const { commentLimiter } = require("../utils/rateLimit");
const {
  getRatingsByDocument,
  createOrUpdateRating,
  getAverageRating,
  deleteRating,
  getRatingDistribution,
} = require("../controller/rating.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Tạo hoặc cập nhật đánh giá
router.post("/:documentId", authMiddleware, commentLimiter, createOrUpdateRating);

// Lấy danh sách đánh giá của tài liệu
router.get("/:documentId", authMiddleware, getRatingsByDocument);

// Lấy điểm trung bình đánh giá
router.get("/:documentId/average", authMiddleware, getAverageRating);

// Lấy phân phối đánh giá
router.get("/:documentId/distribution", authMiddleware, getRatingDistribution);

// Xóa đánh giá
router.delete("/:documentId", authMiddleware, deleteRating);

module.exports = router;
