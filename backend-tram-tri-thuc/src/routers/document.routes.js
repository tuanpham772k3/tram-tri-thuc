const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { upload, cleanupUpload } = require("../middlewares/uploadMiddleware");

const {
    getDocuments,
    getDocumentById,
    downloadDocument,
    viewedDocument,
    getMyDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
} = require("../controller/document.controller");

// Giai đoạn 2: Public view

// Lấy danh sách tài liệu
router.get("/", authMiddleware, getDocuments); //filter ?search, ?category, ?sort, ?page
router.get("/:id", authMiddleware, getDocumentById); // Lấy chi tiết tài liệu
router.get("/:id/download", authMiddleware, downloadDocument); // Tải xuống tài liệu
router.get("/:id/view", authMiddleware, viewedDocument); // Tăng lượt xem tài liệu

// Giai đoạn 3: Uploader quản lý

router.get("/my", authMiddleware, getMyDocuments); // Lấy danh sách tài liệu của tôi
router.post("/", authMiddleware, upload.single("file"), cleanupUpload, uploadDocument); // Tải lên tài liệu mới
router.put("/:id", authMiddleware, updateDocument); // Sửa thông tin tài liệu
router.delete("/:id", authMiddleware, deleteDocument); // Xoá tài liệu

module.exports = router;
