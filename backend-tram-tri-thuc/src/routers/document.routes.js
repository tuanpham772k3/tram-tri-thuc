const express = require("express");
const uploadMiddleware = require("../middlewares/upload.middleware");
const {
  getUploaderDocuments,
  getVipDocuments,
  getDocuments,
  getRelatedDocuments,
  getDocumentById,
  downloadDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
} = require("../controller/document.controller");
const {
  checkVipAccess,
  authMiddleware,
  isUploader,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/uploader", authMiddleware, isUploader, getUploaderDocuments);

//Lấy danh sách tài liệu vip
router.get("/vip", authMiddleware, checkVipAccess, getVipDocuments);

// Lấy danh sách tài liệu với các tùy chọn lọc, phân trang, tìm kiếm
router.get("/", authMiddleware, getDocuments);

// Lấy danh sách tài liệu liên quan theo tags
router.get("/:documentId/related", authMiddleware, getRelatedDocuments);

// Lấy thông tin chi tiết của tài liệu theo ID
router.get("/:documentId", authMiddleware, getDocumentById);

// Tải xuống tài liệu theo ID
router.get("/:documentId/download", authMiddleware, downloadDocument);

// Tải lên tài liệu mới
router.post("/", authMiddleware, isUploader, uploadMiddleware, uploadDocument);

// Cập nhật thông tin tài liệu theo ID
router.patch("/:documentId", authMiddleware, isUploader, updateDocument);

// Xóa tài liệu theo ID
router.delete("/:documentId", authMiddleware, isUploader, deleteDocument);

module.exports = router;
