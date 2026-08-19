const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt");

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

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

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
    next(error);
  }
};

/**
 * Kiểm tra quyền admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
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
    console.log("Role not found in req.user", { user: req.user });
    return res.status(400).json({
      success: false,
      message: "Không tìm thấy vai trò người dùng.",
    });
  }
  if (["uploader", "admin"].includes(req.user.role)) {
    return next();
  }
  console.log("Access denied for non-uploader user", { user: req.user });
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
    console.log("Check VIP access error:", {
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
