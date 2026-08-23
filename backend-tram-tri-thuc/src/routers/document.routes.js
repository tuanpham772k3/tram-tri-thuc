const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getDocuments,
  getRelatedDocuments,
  getDocumentById,
} = require("../controller/document.controller");

const router = express.Router();

// Lấy danh sách tài liệu với các tùy chọn lọc, phân trang, tìm kiếm
router.get("/", authenticate, getDocuments);

// Lấy danh sách tài liệu liên quan theo tags
router.get("/:documentId/related", authenticate, getRelatedDocuments);

// Lấy thông tin chi tiết của tài liệu theo ID
router.get("/:documentId", authenticate, getDocumentById);

module.exports = router;
