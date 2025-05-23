const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const { getOverview, getTopDocuments, getTopUsers } = require("../controller/stat.controller");

// Tổng quan hệ thống
router.get("/overview", authMiddleware, getOverview);

// Top tài liệu
router.get("/top-documents", authMiddleware, getTopDocuments);

// Người dùng nổi bật
router.get("/top-users", authMiddleware, getTopUsers);

module.exports = router;