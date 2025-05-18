const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getUserInfo,
    updateUserInfo,
    getUserHistory,
    getUserFavorites,
    toggleFavorite,
    getUsers,
    getUserDownloads,
} = require("../controller/user.controller");

// Lấy danh sách người dùng
router.get("/", authMiddleware, getUsers);

// Lấy thông tin cá nhân
router.get("/me", authMiddleware, getUserInfo);

// Cập nhật thông tin cá nhân
router.put("/me", authMiddleware, updateUserInfo);

// Lịch sử xem tài liệu
router.get("/history", authMiddleware, getUserHistory);

// Lịch sử tải tài liệu
router.get("/downloads", authMiddleware, getUserDownloads);

// Danh sách tài liệu yêu thích
router.get("/favorites", authMiddleware, getUserFavorites);

// Thêm/xoá tài liệu yêu thích
router.patch("/favorites/:docId", authMiddleware, toggleFavorite);

module.exports = router;
