const express = require("express");
const router = express.Router();
const passport = require("../config/passport.config");
const authMiddleware = require("../middlewares/authMiddleware");
const AuthService = require("../services/auth.service");
const {
    register,
    forgotPassword,
    resetPassword,
    getProfile,
    login,
    refreshToken,
    verifyEmail,
    resendVerificationEmail,
    logout,
} = require("../controller/auth.controller");
const {
    registerLimiter,
    resendVerificationLimiter,
    loginLimiter,
    forgotPasswordLimiter,
} = require("../middlewares/rateLimit");
const { upload } = require("../middlewares/uploadMiddleware");

// API Đăng ký
router.post("/register", registerLimiter, register);

// API Đăng nhập
router.post("/login", login);

// API Đăng xuất
router.post("/logout", authMiddleware, logout);

// API Quên mật khẩu
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// API Reset Password
router.post("/reset-password", resetPassword);

// API Refresh Token
router.post("/refresh-token", refreshToken);

// API Xác thực email
router.post("/verify-email", verifyEmail);

// API gửi lại xác thực email
router.post("/resend-verification", resendVerificationLimiter, resendVerificationEmail);

// API Đăng nhập bằng Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/login" }),
    async (req, res) => {
        try {
            if (!req.user) {
                throw new Error("User not found after Google authentication");
            }
            const tokens = await AuthService.generateTokens(req.user._id);
            req.user.refreshToken = tokens.refreshToken;
            await req.user.save();
            res.redirect(
                `${process.env.CLIENT_URL}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
            );
        } catch (error) {
            console.error("Google callback error:", error.message);
            res.redirect(
                `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(error.message)}`
            );
        }
    }
);

module.exports = router;
