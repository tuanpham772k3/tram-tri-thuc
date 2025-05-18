const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const RefreshTokenModel = require("../models/RefreshToken.model");
const logger = require("../utils/logger");
const { sendResetPasswordEmail, sendVerificationEmail } = require("../utils/email");
const {
    RESET_TOKEN_EXPIRES,
    ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES,
} = require("../config/jwt.config");

class AuthService {
    // Tìm người dùng theo email
    static async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    // Tạo token truy cập và làm mới
    static async generateTokens(userId) {
        // Giới hạn số lượng refresh token tối đa (ví dụ: 5)
        const MAX_TOKENS = 5;
        const existingTokens = await RefreshTokenModel.find({ userId });

        // Nếu vượt quá giới hạn, xóa các token cũ nhất
        if (existingTokens.length >= MAX_TOKENS) {
            const tokensToDelete = existingTokens
                .sort((a, b) => a.createdAt - b.createdAt) // Sắp xếp theo thời gian tạo
                .slice(0, existingTokens.length - MAX_TOKENS + 1); // Giữ lại chỉ số token mới nhất
            await RefreshTokenModel.deleteMany({
                _id: { $in: tokensToDelete.map((token) => token._id) },
            });
        }
        
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES,
        });

        // Tính thời gian hết hạn (7 ngày)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        // Lưu refresh token vào collection RefreshTokens
        await RefreshTokenModel.create({
            userId,
            token: refreshToken,
            expiresAt,
        });

        return { accessToken, refreshToken };
    }

    // Tạo token xác thực
    static async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const tokenRecord = await RefreshTokenModel.findOne({
                userId: decoded.userId,
                token: refreshToken,
                expiresAt: { $gt: new Date() },
            });
            if (!tokenRecord) {
                throw new Error("Invalid or expired refresh token");
            }

            // Tạo token mới
            const tokens = await this.generateTokens(decoded.userId);

            // Xóa token cũ
            await RefreshTokenModel.deleteOne({ _id: tokenRecord._id });

            return tokens;
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }

    // Mã hóa mật khẩu
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // Kiểm tra xem email đã tồn tại chưa
    static async validateAndFindUser(email) {
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
    }

    // Tạo người dùng mới
    static async createUser({ name, email, password }) {
        const hashedPassword = await this.hashPassword(password);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return user;
    }

    // Tạo tài khoản mới
    static async register({ name, email, password }) {
        try {
            await this.validateAndFindUser(email);
            const user = await this.createUser({ name, email, password });
            const tokens = await this.generateTokens(user._id);

            // Gửi email xác minh
            const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            user.emailVerificationToken = verificationToken;
            user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Hết hạn sau 24h
            await user.save();
            await sendVerificationEmail(email, verificationToken);

            logger.info(`User registered successfully: ${email}`);
            return {
                message: "Registration successful. Please verify your email.",
                data: tokens,
            };
        } catch (error) {
            logger.error(`Registration failed for ${email}`, {
                error: error.message,
            });
            throw error;
        }
    }

    //gửi lại email xác minh
    static async resendVerificationEmail(email) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error("Email not found");
        }
        if (user.isEmailVerified) {
            throw new Error("Email already verified");
        }
        const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        await sendVerificationEmail(email, verificationToken);
        return { message: "Verification email resent" };
    }

    // Xác thực email
    static async verifyEmail(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({
                _id: decoded.userId,
                emailVerificationToken: token,
                emailVerificationTokenExpires: { $gt: new Date() },
            });
            if (!user) throw new Error("Invalid or expired verification token");
            if (user.isEmailVerified) throw new Error("Email already verified");

            user.isEmailVerified = true;
            user.emailVerificationToken = null;
            user.emailVerificationTokenExpires = null;
            await user.save();
            return user;
        } catch (error) {
            throw new Error(error.message || "Failed to verify email");
        }
    }

    // Kiểm tra thông tin đăng nhập
    static async validateCredentials(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error("Email not found");
        }
        if (!user.isEmailVerified) {
            throw new Error("Email not verified. Please verify your email before logging in.");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect password");
        }
        return user;
    }

    // Đăng nhập
    static async login({ email, password }) {
        const user = await this.validateCredentials(email, password);
        return this.generateTokens(user._id);
    }

    // Đăng nhập bằng Google
    static generateResetToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRES });
    }

    // Tạo token reset mật khẩu
    static async forgotPassword(email) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error("Email not found");
        }
        const resetToken = this.generateResetToken(user._id);
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

        // Lưu reset token và thời gian hết hạn vào DB
        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        // Gửi email chứa link reset
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await sendResetPasswordEmail(email, resetLink);

        return { message: "Reset password email sent" };
    }

    // Xác thực token reset mật khẩu
    static verifyResetToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    // Cập nhật mật khẩu
    static async updateUserPassword(userId, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const hashedPassword = await this.hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        return user;
    }

    // Đặt lại mật khẩu
    static async resetPassword({ token, newPassword }) {
        const decoded = this.verifyResetToken(token);
        const user = await User.findOne({
            _id: decoded.userId,
            resetToken: token,
            resetTokenExpires: { $gt: new Date() },
        });
        if (!user) {
            throw new Error("Invalid or expired reset token");
        }
        // Kiểm tra độ mạnh mật khẩu
        if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            throw new Error(
                "Password must be at least 6 characters, contain at least one uppercase letter and one number"
            );
        }

        // Cập nhật mật khẩu và xóa reset token
        const hashedPassword = await this.hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();
    }

    // Thêm phương thức để thu hồi refresh token (khi đăng xuất)
    static async revokeRefreshToken(userId, refreshToken) {
        await RefreshTokenModel.deleteOne({ userId, token: refreshToken });
        logger.info(`Refresh token revoked for user: ${userId}`);
    }

    // Thêm phương thức để thu hồi tất cả refresh token của user (khi đăng xuất toàn bộ thiết bị)
    static async revokeAllRefreshTokens(userId) {
        await RefreshTokenModel.deleteMany({ userId });
        logger.info(`All refresh tokens revoked for user: ${userId}`);
    }
}

module.exports = AuthService;
