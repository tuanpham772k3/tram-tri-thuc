const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { commentLimiter } = require("../utils/rateLimit");
const {
  getRatingsByDocument,
  createRating,
  getAverageRating,
  deleteRating,
  getRatingDistribution,
} = require("../controller/rating.controller");

const router = express.Router();

// Tạo hoặc cập nhật đánh giá
router.post("/:documentId", authenticate, commentLimiter, createRating);

// Lấy danh sách đánh giá của tài liệu
router.get("/:documentId", authenticate, getRatingsByDocument);

// Lấy điểm trung bình đánh giá
router.get("/:documentId/average", authenticate, getAverageRating);

// Lấy phân phối đánh giá
router.get("/:documentId/distribution", authenticate, getRatingDistribution);

// Xóa đánh giá
router.delete("/:documentId", authenticate, deleteRating);

module.exports = router;
