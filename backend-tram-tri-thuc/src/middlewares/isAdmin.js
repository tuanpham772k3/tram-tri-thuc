/**
 * Middleware kiểm tra quyền admin.
 * Dùng cho các route cần quyền quản trị như: quản lý người dùng, phê duyệt tài liệu, thống kê hệ thống...
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

module.exports = isAdmin;
