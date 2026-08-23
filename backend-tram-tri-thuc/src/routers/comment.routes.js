const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { commentLimiter } = require("../utils/rateLimit");
const {
  getCommentsByDocument,
  createComment,
  updateComment,
  deleteComment,
} = require("../controller/comment.controller");

const router = express.Router();

// Lấy danh sách bình luận của tài liệu
router.get("/:documentId", authenticate, getCommentsByDocument);

// Tạo bình luận
router.post("/:documentId", authenticate, commentLimiter, createComment);

// Cập nhật bình luận
router.put("/:commentId", authenticate, commentLimiter, updateComment);

// Xóa bình luận
router.delete("/:commentId", authenticate, deleteComment);
