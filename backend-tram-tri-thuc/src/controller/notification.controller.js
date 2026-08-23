const mongoose = require("mongoose");
const Notification = require("../models/notification.model");

const {
  AppError,
  sendSuccess,
  asyncHandler,
  getPagination,
  buildMeta,
} = require("../utils/helper");

// Lấy danh sách thông báo của người dùng
exports.getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit, sort } = req.query;

  const pagination = getPagination({ page, limit });

  const query = {
    userId,
    isRead: false,
  };

  const notifications = await Notification.find(query)
    .sort(sort || { createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const totalNot = await Notification.countDocuments(query);

  const meta = buildMeta(pagination.page, pagination.limit, totalNot);

  return sendSuccess(
    res,
    notifications,
    "Lấy danh sách thông báo thành công.",
    200,
    meta
  );
});

// Đánh dấu thông báo là chưa đọc
exports.markAsUnread = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new AppError("ID thông báo không hợp lệ.", 400);
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
    },
    {
      isRead: false,
      updatedAt: new Date(),
    },
    {
      new: true,
    }
  );

  if (!notification) {
    throw new AppError("Thông báo không tồn tại.", 404);
  }

  return sendSuccess(res, notification, "Đánh dấu thông báo chưa đọc.");
});

// Đánh dấu thông báo là đã đọc
exports.markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new AppError("ID thông báo không hợp lệ.", 400);
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new AppError("Thông báo không tồn tại.", 404);
  }

  notification.isRead = true;
  notification.updatedAt = new Date();

  await notification.save();

  return sendSuccess(res, notification, "Đánh dấu thông báo đã đọc.");
});

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    {
      userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        updatedAt: new Date(),
      },
    }
  );

  return sendSuccess(res, null, "Đánh dấu tất cả thông báo đã đọc.");
});

// Xóa thông báo của người dùng
exports.deleteNotifications = asyncHandler(async (req, res) => {
  const { notificationIds } = req.body;

  const query = {
    userId: req.user._id,
  };

  if (notificationIds?.length) {
    query._id = {
      $in: notificationIds,
    };
  }

  await Notification.deleteMany(query);

  return sendSuccess(res, null, "Xóa thông báo thành công.");
});
