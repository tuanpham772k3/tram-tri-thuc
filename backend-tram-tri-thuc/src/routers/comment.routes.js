const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    addComment,
    getCommentsByDocument,
    deleteComment,
} = require("../controller/comment.controller");

// Bình luận tài liệu
router.post("/", authMiddleware, addComment);

// Lấy bình luận theo tài liệu
router.get("/:documentId", authMiddleware, getCommentsByDocument);

// Xóa bình luận (user hoặc admin)
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
