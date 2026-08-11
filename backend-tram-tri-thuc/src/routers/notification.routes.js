const express = require("express");
const router = express.Router();
const {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
    markAsUnread,
} = require("../controller/notification.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Tạo thông báo (admin only)
router.post("/notifications", authMiddleware, isAdmin, createNotification);

// Lấy danh sách thông báo của người dùng
router.get("/notifications", authMiddleware, getNotifications);

// Đánh dấu thông báo là đã đọc
router.patch("/notifications/:id/read", authMiddleware, markNotificationAsRead);

// Đánh dấu thông báo là chưa đọc
router.patch("/notifications/:id/unread", authMiddleware, markAsUnread);

// Đánh dấu tất cả thông báo là đã đọc
router.patch("/notifications/read-all", authMiddleware, markAllNotificationsAsRead);

// Xóa thông báo
router.delete("/notifications/:id", authMiddleware, deleteNotification);

// Xóa tất cả thông báo của người dùng
router.delete("/notifications", authMiddleware, deleteAllNotifications);

module.exports = router;
