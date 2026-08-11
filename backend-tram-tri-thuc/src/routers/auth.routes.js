const express = require("express");
const router = express.Router();
const { forgotPasswordLimiter, loginLimiter } = require("../utils/rateLimit");
const {
    register,
    forgotPassword,
    resetPassword,
    login,
    refreshToken,
    logout,
    verifyEmail,
    resendVerificationEmail,
} = require("../controller/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// API Đăng ký
router.post("/register", register);
// API Đăng nhập
router.post("/login", loginLimiter, login);
// API Quên mật khẩu
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
// API Reset Password
router.post("/reset-password", resetPassword);
// API Refresh Token
router.post("/refresh-token", refreshToken);
// Xác thực email bằng mã OTP
router.post("/verify-email", verifyEmail);
//Gửi lại mã xác thực email
router.post("/resend-verification", resendVerificationEmail);
// API Logout
router.post("/logout", authMiddleware, logout);

module.exports = router;
