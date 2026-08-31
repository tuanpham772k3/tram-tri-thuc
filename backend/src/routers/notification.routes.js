const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotifications,
  markAsUnread,
} = require("../controller/notification.controller");

const router = express.Router();

// Lấy danh sách thông báo
router.get("/", authenticate, getNotifications);

// Đánh dấu thông báo là chưa đọc
router.patch("/:notificationId/unread", authenticate, markAsUnread);

// Đánh dấu thông báo là đã đọc
router.patch("/:notificationId/read", authenticate, markNotificationAsRead);

// Đánh dấu tất cả thông báo là đã đọc
router.patch("/read-all", authenticate, markAllNotificationsAsRead);

// Xóa thông báo
router.delete("/", authenticate, deleteNotifications);

module.exports = router;
