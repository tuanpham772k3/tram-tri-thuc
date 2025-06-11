const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const crypto = require("crypto");
const { sendVerificationCodeEmail, sendResetPasswordEmail } = require("../services/email.service");
const { default: mongoose } = require("mongoose");

// Helper tạo token
const createAccessToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES || "1h",
    });

const createRefreshToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
    });

// Helper validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ====================== [POST] /register ======================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Tên không được để trống.",
            });
        }
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ.",
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự.",
            });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã được đăng ký.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        const newUser = new User({
            name: name.trim(),
            email,
            password: hashedPassword,
            emailVerified: false,
            verificationCode,
            verificationCodeExpires,
        });

        await newUser.save();

        // Gửi email xác thực OTP
        try {
            await sendVerificationCodeEmail(email, verificationCode);
        } catch (emailError) {
            logger.error(`Failed to send verification email to ${email}:`, emailError);
            return res.status(500).json({
                success: false,
                message:
                    "Đăng ký thành công nhưng không thể gửi email xác thực. Vui lòng thử lại sau.",
            });
        }

        logger.info(`User registered with verification code: ${email}`);

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
            data: {
                userId: newUser._id, // Thêm userId để frontend redirect
                email: newUser.email,
            },
        });
    } catch (error) {
        logger.error("Register error:", error);
        res.status(500).json({ success: false, message: "Đăng ký thất bại." });
    }
};

// ====================== [POST] /login ======================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ.",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không được để trống.",
            });
        }
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Email không tồn tại hoặc tài khoản không hợp lệ.",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản của bạn đã bị vô hiệu hóa.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Sai mật khẩu.",
            });
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        user.token = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            sameSite: "strict",
        });

        logger.info(`User login: ${user.email} | role: ${user.role}`);
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    isVip: user.isVip,
                },
                accessToken,
            },
        });
    } catch (error) {
        logger.error("Login error:", { error: error.message });
        res.status(500).json({ success: false, message: "Đăng nhập thất bại." });
    }
};

// ====================== [POST] /forgot-password ======================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ.",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản với email này.",
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản chưa được xác thực email.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 10); // 10 phút

        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        // Tạo link reset password
        const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

        try {
            await sendResetPasswordEmail(email, resetLink);
            logger.info(`Password reset email sent to: ${email}`);
        } catch (emailError) {
            logger.error(`Gửi email reset password thất bại: ${emailError.message}`);
            user.resetToken = null;
            user.resetTokenExpires = null;
            await user.save();
            return res.status(500).json({
                success: false,
                message: "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Link đặt lại mật khẩu đã được gửi tới email của bạn.",
            data: {},
        });
    } catch (error) {
        logger.error("Forgot password error:", error);
        res.status(500).json({ success: false, message: "Không thể gửi yêu cầu." });
    }
};

// ====================== [POST] /reset-password ======================
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Validate input
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token không được để trống.",
            });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
            });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;

        await user.save();
        logger.info(`Password reset successful for: ${user.email}`);
        res.status(200).json({
            success: true,
            message: "Mật khẩu được đặt lại thành công!",
            data: {},
        });
    } catch (error) {
        logger.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Không thể đặt lại mật khẩu.",
        });
    }
};

// ====================== [POST] /refresh-token ======================
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Thiếu refreshToken.",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "RefreshToken đã hết hạn.",
                });
            }
            return res.status(401).json({
                success: false,
                message: "RefreshToken không hợp lệ.",
            });
        }

        const user = await User.findById(decoded.id);
        if (!user || user.token !== refreshToken) {
            logger.warn(`Refresh token không hợp lệ cho userId: ${decoded.id}`);
            return res.status(403).json({
                success: false,
                message: "RefreshToken không hợp lệ hoặc đã bị thu hồi.",
            });
        }

        const accessToken = createAccessToken(user);
        logger.info(`Access token refreshed for userId: ${user._id}`);
        res.status(200).json({
            success: true,
            message: "Làm mới token thành công.",
            data: { accessToken },
        });
    } catch (error) {
        logger.error("Refresh token error:", { error: error.message });
        res.status(500).json({
            success: false,
            message: "Không thể làm mới token.",
        });
    }
};

// ====================== [POST] /logout ======================
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Thiếu refreshToken để đăng xuất.",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "RefreshToken không hợp lệ.",
            });
        }

        const user = await User.findById(decoded.id);
        if (!user || user.token !== refreshToken) {
            return res.status(403).json({
                success: false,
                message: "RefreshToken không hợp lệ.",
            });
        }

        user.token = null;
        await user.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        logger.info(`User logged out: ${user.email}`);
        res.status(200).json({
            success: true,
            message: "Đăng xuất thành công.",
            data: {},
        });
    } catch (error) {
        logger.error("Logout error:", { error: error.message });
        res.status(500).json({
            success: false,
            message: "Đăng xuất thất bại.",
        });
    }
};

// ====================== [POST] /verify-email ======================
exports.verifyEmail = async (req, res) => {
    try {
        const { userId, verificationCode } = req.body;

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "userId không hợp lệ.",
            });
        }
        if (!verificationCode || verificationCode.length !== 6) {
            return res.status(400).json({
                success: false,
                message: "Mã xác thực phải có 6 ký tự.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản với email này.",
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email đã được xác thực.",
            });
        }

        if (
            !user.verificationCode ||
            user.verificationCode !== verificationCode ||
            !user.verificationCodeExpires ||
            user.verificationCodeExpires < Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "Mã xác thực không hợp lệ hoặc đã hết hạn.",
            });
        }

        // Xác thực thành công
        user.emailVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        logger.info(`Email verified for: ${user.email}`);
        res.status(200).json({
            success: true,
            message: "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.",
            data: {},
        });
    } catch (error) {
        logger.error("Verify email error:", error);
        res.status(500).json({
            success: false,
            message: "Xác thực email thất bại.",
        });
    }
};

// ====================== [POST] /resend-verification ======================
exports.resendVerificationEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "userId không hợp lệ.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản với email này.",
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email đã được xác thực.",
            });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        try {
            await sendVerificationCodeEmail(user.email, verificationCode);
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Không thể gửi lại email xác thực. Vui lòng thử lại sau.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.",
            data: {},
        });
    } catch (error) {
        logger.error("Resend verification email error:", error);
        res.status(500).json({
            success: false,
            message: "Không thể gửi lại email xác thực.",
        });
    }
};
