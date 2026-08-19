const express = require("express");
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotifications,
  markAsUnread,
} = require("../controller/notification.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Lấy danh sách thông báo
router.get("/", authMiddleware, getNotifications);

// Đánh dấu thông báo là chưa đọc
router.patch("/:notificationId/unread", authMiddleware, markAsUnread);

// Đánh dấu thông báo là đã đọc
router.patch("/:notificationId/read", authMiddleware, markNotificationAsRead);

// Đánh dấu tất cả thông báo là đã đọc
router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

// Xóa thông báo
router.delete("/", authMiddleware, deleteNotifications);

module.exports = router;
