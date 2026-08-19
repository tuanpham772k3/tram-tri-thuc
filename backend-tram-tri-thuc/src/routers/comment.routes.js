const express = require("express");
const { commentLimiter } = require("../utils/rateLimit");
const {
  getCommentsByDocument,
  createComment,
  updateComment,
  deleteComment,
  reportComment,
} = require("../controller/comment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Lấy danh sách bình luận của tài liệu
router.get("/:documentId", getCommentsByDocument);

// Tạo bình luận
router.post("/:documentId", authMiddleware, commentLimiter, createComment);

// Cập nhật bình luận
router.put("/:commentId", authMiddleware, commentLimiter, updateComment);

// Xóa bình luận
router.delete("/:commentId", authMiddleware, deleteComment);
