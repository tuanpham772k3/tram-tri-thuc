const Notification = require("../models/Notifications.model");

// Lấy thông báo của user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Đánh dấu một thông báo đã đọc
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Thông báo không tồn tại." });
        }

        res.json({ message: "Đã đánh dấu đã đọc.", notification });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};

// Đánh dấu tất cả thông báo đã đọc
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
        res.json({ message: "Đã đánh dấu tất cả thông báo là đã đọc." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server.", error: error.message });
    }
};
