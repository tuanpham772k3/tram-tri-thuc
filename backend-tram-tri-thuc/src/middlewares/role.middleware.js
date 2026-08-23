const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập tài nguyên này. Chỉ dành cho admin.",
    });
  }
  next();
};

const isUploader = (req, res, next) => {
  if (!req.user || req.user.role !== "uploader") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập tài nguyên này. Chỉ dành cho uploader.",
    });
  }
  next();
};

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

module.exports = { isAdmin, isUploader, checkVipAccess };
