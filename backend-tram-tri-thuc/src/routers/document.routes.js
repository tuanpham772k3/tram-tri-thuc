const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { upload, cleanupUpload } = require("../middlewares/uploadMiddleware");

const {
    getDocuments,
    getDocumentById,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    viewedDocument,
} = require("../controller/document.controller");

// Lấy danh sách tài liệu
router.get("/", authMiddleware, getDocuments);

// Lấy chi tiết tài liệu
// router.get("/:id", authMiddleware, getDocumentById);

// Tải lên tài liệu mới
router.post("/", authMiddleware, upload.single("file"), cleanupUpload, uploadDocument);

// Sửa thông tin tài liệu
// router.put("/:id", authMiddleware, updateDocument);

// Xoá tài liệu
// router.delete("/:id", authMiddleware, deleteDocument);

// Tải tài liệu
// router.get("/:id/download", authMiddleware, downloadDocument);

// Tăng lượt xem tài liệu
// router.get("/:id/view", authMiddleware, viewedDocument);

module.exports = router;
