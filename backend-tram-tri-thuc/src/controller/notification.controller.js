const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const { getPagination, getPagingData } = require("../utils/paginate");
const mongoose = require("mongoose");

// Hàm validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Tạo thông báo
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message, link } = req.body;

    // Validation
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID người dùng không hợp lệ." });
    }
    if (!["new_comment", "document_approved", "new_rating", "system"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Loại thông báo không hợp lệ." });
    }
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Nội dung không được rỗng." });
    }
    if (!link || typeof link !== "string" || link.trim() === "") {
      return res.status(400).json({ success: false, message: "Link không được rỗng." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại." });
    }

    const notification = new Notification({
      userId,
      type,
      message: message.trim(),
      link: link.trim(),
    });

    await notification.save();

    // Gửi thông báo qua WebSocket nếu có
    if (req.io) {
      req.io.to(userId).emit("newNotification", notification);
    }
    console.log(`Notification created for user ${userId}, type: ${type}`);

    res.status(201).json({
      success: true,
      message: "Gửi thông báo thành công.",
      data: notification,
    });
  } catch (error) {
    console.log(`Create notification error: ${error.message}`);
    res.status(500).json({ success: false, message: "Lỗi server khi tạo thông báo." });
  }
};

// Lấy danh sách thông báo của người dùng
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, unreadOnly, sort = "-createdAt" } = req.query;

    // Validation
    if (isNaN(page) || page < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Trang phải là số nguyên dương." });
    }
    if (isNaN(limit) || limit < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Giới hạn phải là số nguyên dương." });
    }
    if (unreadOnly && !["true", "false"].includes(unreadOnly)) {
      return res
        .status(400)
        .json({ success: false, message: "unreadOnly phải là boolean." });
    }
    if (sort && !["createdAt", "-createdAt"].includes(sort)) {
      return res
        .status(400)
        .json({ success: false, message: "Sort phải là createdAt hoặc -createdAt." });
    }

    const { skip } = getPagination({ page, limit });
    const query = { userId };
    if (unreadOnly === "true") query.isRead = false;

    const notifications = await Notification.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Notification.countDocuments(query);
    const pagingData = getPagingData(notifications, total, Number(page), Number(limit));

    res.status(200).json({ success: true, data: pagingData });
  } catch (error) {
    console.log(`Get notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách thông báo.",
    });
  }
};

// Đánh dấu thông báo là đã đọc
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validation
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thông báo không hợp lệ." });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Thông báo không tồn tại." });
    }
    if (notification.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền cập nhật thông báo này." });
    }

    notification.isRead = true;
    notification.updatedAt = new Date();
    await notification.save();

    console.log(`Notification ${id} marked as read by user ${userId}`);
    res.status(200).json({
      success: true,
      message: "Đánh dấu thông báo đã đọc.",
      data: notification,
    });
  } catch (error) {
    console.log(`Mark notification read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đánh dấu thông báo đã đọc.",
    });
  }
};

// Đánh dấu thông báo là chưa đọc
exports.markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validation
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thông báo không hợp lệ." });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: false, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Thông báo không tồn tại hoặc bạn không có quyền.",
      });
    }

    console.log(`Notification ${id} marked as unread by user ${userId}`);
    res.status(200).json({
      success: true,
      message: "Đánh dấu thông báo chưa đọc.",
      data: notification,
    });
  } catch (error) {
    console.log(`Mark notification unread error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đánh dấu thông báo chưa đọc.",
    });
  }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true, updatedAt: new Date() } }
    );

    console.log(`All notifications marked as read for user ${userId}`);
    res.status(200).json({ success: true, message: "Đánh dấu tất cả thông báo đã đọc." });
  } catch (error) {
    console.log(`Mark all notifications read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đánh dấu tất cả thông báo đã đọc.",
    });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validation
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thông báo không hợp lệ." });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Thông báo không tồn tại." });
    }
    if (notification.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền xóa thông báo này." });
    }

    await notification.deleteOne();
    console.log(`Notification ${id} deleted by user ${userId}`);
    res.status(200).json({ success: true, message: "Xóa thông báo thành công." });
  } catch (error) {
    console.log(`Delete notification error: ${error.message}`);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa thông báo." });
  }
};

// Xóa tất cả thông báo của người dùng
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ userId });
    console.log(`All notifications deleted for user ${userId}`);
    res.status(200).json({ success: true, message: "Xóa tất cả thông báo thành công." });
  } catch (error) {
    console.log(`Delete all notifications error: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa tất cả thông báo." });
  }
};
