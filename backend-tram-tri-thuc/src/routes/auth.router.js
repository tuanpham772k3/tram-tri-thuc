const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    register,
    forgotPassword,
    resetPassword,
    getProfile,
    login,
} = require("../controller/auth.controller");
const router = express.Router();

// 2.1 API Đăng ký
router.post("/register", register);

// 2.2 API Đăng nhập
router.post("/login", login);

// 2.4 API Quên mật khẩu
router.post("/forgot-password", forgotPassword);

// API Reset Password
router.post("/reset-password", resetPassword);

// 2.5 Route bảo vệ (Ví dụ)
router.get("/home", authMiddleware, getProfile);

module.exports = router;
