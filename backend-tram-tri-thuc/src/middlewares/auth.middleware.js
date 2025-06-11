const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const logger = require("../utils/logger");
const { Types } = require("mongoose");

if (!process.env.JWT_SECRET) {
    throw new Error("Thiếu JWT_SECRET trong biến môi trường");
}

/**
 * Xác thực người dùng dựa trên JWT token
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Không có token. Vui lòng đăng nhập.",
            });
        }

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!Types.ObjectId.isValid(decoded.id)) {
            logger.error("Invalid user ID in token", { id: decoded.id });
            return res.status(400).json({
                success: false,
                message: "ID người dùng không hợp lệ trong token.",
            });
        }

        const user = await User.findById(decoded.id).select("_id email role isActive isVip");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại.",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản của bạn đã bị vô hiệu hóa.",
            });
        }

        req.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            isVip: user.isVip,
        };
        next();
    } catch (error) {
        logger.error("Authentication error", {
            error: error.message,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ.",
        });
    }
};

/**
 * Kiểm tra quyền admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        logger.warn("Access denied for non-admin user", { user: req.user });
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập tài nguyên này. Chỉ dành cho admin.",
        });
    }
    next();
};

/**
 * Kiểm tra quyền uploader hoặc admin
 */
const isUploader = (req, res, next) => {
    if (!req.user?.role) {
        logger.error("Role not found in req.user", { user: req.user });
        return res.status(400).json({
            success: false,
            message: "Không tìm thấy vai trò người dùng.",
        });
    }
    if (["uploader", "admin"].includes(req.user.role)) {
        return next();
    }
    logger.warn("Access denied for non-uploader user", { user: req.user });
    return res.status(403).json({
        success: false,
        message: "Yêu cầu quyền uploader hoặc admin.",
    });
};

/**
 * Kiểm tra quyền VIP hoặc admin
 */
const checkVipAccess = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.",
            });
        }

        if (req.user.role !== "admin" && req.user.isVip !== "active") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập tài liệu VIP.",
            });
        }

        next();
    } catch (error) {
        logger.error("Check VIP access error:", {
            message: error.message,
            stack: error.stack,
            userId: req.user?._id,
        });
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi kiểm tra quyền VIP.",
        });
    }
};

module.exports = {
    authMiddleware,
    isAdmin,
    isUploader,
    checkVipAccess,
};
