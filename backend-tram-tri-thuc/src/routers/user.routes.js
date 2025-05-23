const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getUserInfo,
    updateUserInfo,
    getUserHistory,
    getUserFavorites,
    toggleFavorite,
    getUsers,
    getUserDownloads,
    deleteMyAccount,
} = require("../controller/user.controller");
const { param } = require("express-validator");
const validate = require("../middlewares/validate");

// Lấy danh sách người dùng(admin)
router.get("/", authMiddleware, isAdmin, getUsers);

// Lấy thông tin cá nhân
router.get("/me", authMiddleware, getUserInfo);

// Cập nhật thông tin cá nhân
router.put("/me", authMiddleware, updateUserInfo);

// Xoá tài khoản
router.delete("/me", authMiddleware, deleteMyAccount);

// Lịch sử xem tài liệu
router.get("/me/history", authMiddleware, getUserHistory);

// Lịch sử tải tài liệu
router.get("/me/downloads", authMiddleware, getUserDownloads);

// Danh sách tài liệu yêu thích
router.get("/me/favorites", authMiddleware, getUserFavorites);

// Thêm/xoá tài liệu yêu thích
router.post(
    "/documents/:id/favorite",
    authMiddleware,
    [param("id").isMongoId().withMessage("ID tài liệu không hợp lệ"), validate],
    toggleFavorite
);

module.exports = router;
