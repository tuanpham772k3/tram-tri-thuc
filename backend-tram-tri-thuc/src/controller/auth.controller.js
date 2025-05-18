const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const AuthService = require("../services/auth.service");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).max(100).required(),
});

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).max(100).required(),
    newPassword: Joi.string().min(6).max(100).required(),
});

// Register
const register = [
    validateRequest(registerSchema),
    async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const response = await AuthService.register({ name, email, password });
            res.status(201).json({
                success: true,
                message: "Registration successful",
                data: response.data,
            });
        } catch (error) {
            logger.error("Server error during registration:", {
                error: error.message,
                email: req.body.email,
            });
            res.status(error.message.includes("Email already in use") ? 400 : 500).json({
                success: false,
                message: error.message || "Server error during registration",
            });
        }
    },
];

// Login
const login = [
    validateRequest(loginSchema),
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const tokens = await AuthService.login({ email, password });
            res.json({
                success: true,
                message: "Login successful",
                data: tokens,
            });
        } catch (error) {
            console.error("Server error during login:", error.message);
            const status = error.message.includes("Email not found")
                ? 404
                : error.message.includes("Incorrect password")
                  ? 401
                  : error.message.includes("Email not verified")
                    ? 403
                    : 500;
            res.status(status).json({
                success: false,
                message: error.message || "Server error during login",
            });
        }
    },
];

// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "Refresh token is required" });
        }
        const tokens = await AuthService.refreshToken(refreshToken);
        res.json({ success: true, data: tokens });
    } catch (error) {
        console.error("Server error during token refresh:", error.message);
        res.status(401).json({ success: false, message: error.message });
    }
};

// Quên mật khẩu
const forgotPassword = [
    validateRequest(forgotPasswordSchema),
    async (req, res) => {
        try {
            const { email } = req.body;
            await AuthService.forgotPassword(email);
            res.json({
                success: true,
                message: "Reset password email sent. Please check your inbox or spam folder.",
            });
        } catch (error) {
            logger.error("Server error during password reset request:", {
                error: error.message,
                email: req.body.email,
            });
            res.status(error.message.includes("Email not found") ? 404 : 500).json({
                success: false,
                message: error.message.includes("Failed to send reset email")
                    ? "Unable to send reset email. Please try again later."
                    : error.message || "Server error during password reset request",
            });
        }
    },
];

// Đặt lại mật khẩu
const resetPassword = [
    validateRequest(resetPasswordSchema),
    async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            await AuthService.resetPassword({ token, newPassword });
            res.json({
                success: true,
                message: "Password reset successful",
            });
        } catch (error) {
            console.error("Invalid or expired token:", error.message);
            res.status(400).json({
                success: false,
                message: error.message || "Invalid or expired token",
            });
        }
    },
];

// Xác thực email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required",
            });
        }
        const user = await AuthService.verifyEmail(token);
        res.json({
            success: true,
            message: "Email verified successfully",
            data: {
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        logger.error("Error verifying email:", { error: error.message });
        res.status(400).json({
            success: false,
            message: error.message || "Failed to verify email",
        });
    }
};

// Gửi lại email xác minh
const resendVerificationEmail = [
    validateRequest(forgotPasswordSchema), // Tái sử dụng schema vì chỉ cần email
    async (req, res) => {
        try {
            const { email } = req.body;
            await AuthService.resendVerificationEmail(email);
            res.json({
                success: true,
                message: "Verification email resent",
            });
        } catch (error) {
            console.error("Server error during resend verification:", error.message);
            res.status(error.message.includes("Email not found") ? 404 : 400).json({
                success: false,
                message: error.message || "Server error during resend verification",
            });
        }
    },
];

const logout = [
    validateRequest(logoutSchema),
    async (req, res) => {
        try {
            const { refreshToken } = req.body;
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            await AuthService.revokeRefreshToken(decoded.userId, refreshToken);
            res.json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error) {
            logger.error("Server error during logout:", { error: error.message });
            res.status(400).json({
                success: false,
                message: error.message || "Failed to logout",
            });
        }
    },
];

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
    verifyEmail,
    resendVerificationEmail,
    logout,
};
