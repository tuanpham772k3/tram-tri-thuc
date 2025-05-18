/**
 * Middleware kiểm tra quyền admin.
 * Dùng cho các route: quản lý user, duyệt tài liệu, thống kê, chỉnh sửa danh mục.
 * Yêu cầu: req.user phải tồn tại và có thuộc tính role === 'admin'.
 */
function isAdmin(req, res, next) {
    // Kiểm tra xem user đã được xác thực và có quyền admin chưa
    if (req.user && req.user.role === "admin") {
        return next();
    }
    // Nếu không phải admin, trả về lỗi 403 Forbidden
    return res.status(403).json({ message: "Admin only" });
}

module.exports = isAdmin;
