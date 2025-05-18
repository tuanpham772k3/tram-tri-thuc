const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getNotifications,
    markAsRead,
    markAllAsRead,
} = require("../controller/notification.controller");

// Lấy thông báo
router.get("/", authMiddleware, getNotifications);

// Đánh dấu đã đọc
router.patch("/:id/read", authMiddleware, markAsRead);

// Đánh dấu tất cả đã đọc
router.patch("/read-all", authMiddleware, markAllAsRead);

module.exports = router;
