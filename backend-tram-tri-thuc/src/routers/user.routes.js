const express = require("express");
const router = express.Router();
const {
    getUserInfo,
    updateUserInfo,
    getUserHistory,
    getUserFavorites,
    getUsers,
    getUserDownloads,
    deleteMyAccount,
    CallBack,
    PaymentZaloPay,
} = require("../controller/user.controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth.middleware");

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

// thanh toán
router.post("/paymentZaloPay", authMiddleware, PaymentZaloPay);
router.post("/callback", CallBack);

module.exports = router;
