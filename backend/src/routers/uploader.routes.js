const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const { isUploader } = require("../middlewares/role.middleware");
const {
  getUploaderDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
} = require("../controller/uploader.controller");

const router = express.Router();

// Lấy danh sách tài liệu của uploader
router.get("/uploader", authenticate, isUploader, getUploaderDocuments);

// Tải lên tài liệu mới
router.post("/", authenticate, uploadMiddleware, isUploader, uploadDocument);

// Cập nhật thông tin tài liệu theo ID
router.patch("/:documentId", authenticate, isUploader, updateDocument);

// Xóa tài liệu theo ID
router.delete("/:documentId", authenticate, isUploader, deleteDocument);

module.exports = router;
