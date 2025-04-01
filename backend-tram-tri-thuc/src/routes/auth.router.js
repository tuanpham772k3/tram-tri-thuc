const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User.model");
const authMiddleware = require("../middlewares/authMiddleware");

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 2.1 API Đăng ký (Register)
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Tạo JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "Đăng ký thành công", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// 2.2 API Đăng nhập (Login)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không đúng" });
        }

        // Tạo JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// 2.3 API Đăng xuất (Logout)
// Không cần API phía server, xử lý ở frontend bằng cách xóa token khỏi localStorage.

// 2.4 API Quên mật khẩu (Forgot Password)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        // Tạo reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        // Gửi email
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Đặt lại mật khẩu",
            html: `<p>Nhấn vào <a href="${resetLink}">đây</a> để đặt lại mật khẩu. Link có hiệu lực trong 10 phút.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email đã được gửi" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// API Reset Password
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Xác minh token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Người dùng không tồn tại" });
        }

        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
});

// 2.5 Route bảo vệ (Ví dụ)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

module.exports = router;
