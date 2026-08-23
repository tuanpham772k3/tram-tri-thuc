const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const { getPagination, buildMeta } = require("../utils/helper");

// Lấy danh sách thông báo của người dùng
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, sort } = req.query;

    const pagination = getPagination({ page, limit });

    const notifications = await Notification.find({
      userId,
      isRead: false,
    })
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();

    const totalNot = await Notification.countDocuments(query);

    const pagingData = buildMeta(page, limit, totalNot);

    return res.status(200).json({
      success: true,
      data: notifications,
      meta: pagingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách thông báo.",
    });
  }
};

// Đánh dấu thông báo là chưa đọc
exports.markAsUnread = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "ID thông báo không hợp lệ.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { isRead: false, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Thông báo không tồn tại.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đánh dấu thông báo chưa đọc.",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi đánh dấu thông báo chưa đọc.",
    });
  }
};

// Đánh dấu thông báo là đã đọc
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thông báo không hợp lệ." });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Thông báo không tồn tại.",
      });
    }

    notification.isRead = true;
    notification.updatedAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Đánh dấu thông báo đã đọc.",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đánh dấu thông báo đã đọc.",
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

    return res.status(200).json({
      success: true,
      message: "Đánh dấu tất cả thông báo đã đọc.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đánh dấu tất cả thông báo đã đọc.",
    });
  }
};

// Xóa thông báo của người dùng
exports.deleteNotifications = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    const query = { userId: req.user._id };

    if (notificationIds?.length) {
      query._id = { $in: notificationIds };
    }

    await Notification.deleteMany(query);

    return res.status(200).json({
      success: true,
      message: "Xóa thông báo thành công.",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa thông báo.",
    });
  }
};
