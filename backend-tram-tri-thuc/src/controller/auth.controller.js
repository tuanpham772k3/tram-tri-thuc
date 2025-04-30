const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const AuthService = require("../services/auth.service");

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

// Register
const register = [
    validateRequest(registerSchema),
    async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const token = await AuthService.register({ name, email, password });
            res.status(201).json({
                success: true,
                message: "Registration successful",
                data: { token },
            });
        } catch (error) {
            console.error("Server error during registration:", error.message);
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
            const token = await AuthService.login({ email, password });
            res.json({
                success: true,
                message: "Login successful",
                data: { token },
            });
        } catch (error) {
            console.error("Server error during login:", error.message);
            const status = error.message.includes("Email not found")
                ? 404
                : error.message.includes("Incorrect password")
                  ? 401
                  : 500;
            res.status(status).json({
                success: false,
                message: error.message || "Server error during login",
            });
        }
    },
];

// Forgot Password
const forgotPassword = [
    validateRequest(forgotPasswordSchema),
    async (req, res) => {
        try {
            const { email } = req.body;
            const resetToken = await AuthService.forgotPassword(email);
            res.json({
                success: true,
                message: "Reset email sent (Nodemailer not configured)",
                data: { resetToken }, // Temporary for testing
            });
        } catch (error) {
            console.error("Server error during password reset request:", error.message);
            res.status(error.message.includes("Email not found") ? 404 : 500).json({
                success: false,
                message: error.message || "Server error during password reset request",
            });
        }
    },
];

// Reset Password
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

// Get Profile
const getProfile = async (req, res) => {
    try {
        const user = await AuthService.getProfile(req.user);
        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Server error while retrieving profile:", error.message);
        res.status(404).json({
            success: false,
            message: error.message || "Server error while retrieving profile",
        });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    getProfile,
};
