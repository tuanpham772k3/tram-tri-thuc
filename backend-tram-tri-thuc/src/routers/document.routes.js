const express = require("express");
const router = express.Router();
const isUploader = require("../middlewares/isUploader");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const {
    getDocuments,
    getDocumentById,
    getDocumentBySlug,
    downloadDocument,
    uploadDocument,
    getMyDocuments,
    updateDocument,
    deleteDocument,
    getFeaturedDocuments,
    toggleFavorite,
    getRelatedDocuments,
} = require("../controller/document.controller");
const { documentListLimiter } = require("../middlewares/rateLimit");

// Lấy danh sách tài liệu của người dùng hiện tại
router.get("/me", authMiddleware, isUploader, getMyDocuments);

// Lấy tài liệu nổi bật
router.get("/featured", getFeaturedDocuments);

// Lấy danh sách tài liệu với các tùy chọn lọc, phân trang, tìm kiếm
router.get("/", documentListLimiter, getDocuments);

// Lấy thông tin chi tiết của tài liệu theo ID
router.get("/:id", authMiddleware, getDocumentById);

// Lấy thông tin chi tiết của tài liệu theo slug
router.get("/slug/:slug", authMiddleware, getDocumentBySlug);

// Tải xuống tài liệu theo ID
router.get("/:id/download", authMiddleware, downloadDocument);

// Tải lên tài liệu mới
router.post("/", authMiddleware, isUploader, uploadMiddleware, uploadDocument);

// Cập nhật thông tin tài liệu theo ID
router.patch("/:id", authMiddleware, isUploader, updateDocument);

// Xóa tài liệu theo ID
router.delete("/:id", authMiddleware, isUploader, deleteDocument);

// Thêm/xoá tài liệu yêu thích
router.post("/:id/favorite", authMiddleware, toggleFavorite);

// Lấy danh sách tài liệu liên quan theo tags
router.get("/:id/related", getRelatedDocuments);

module.exports = router;
