const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");

const User = require("../models/user.model");
const Rating = require("../models/rating.model");
const Document = require("../models/document.model");
const Comment = require("../models/comment.model");

const { AppError, sendSuccess, asyncHandler } = require("../utils/helper");

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

// Lấy thông tin người dùng
const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -passwordResetToken -token")
    .lean();

  if (!user) {
    throw new AppError("Không tìm thấy người dùng.", 404);
  }

  return sendSuccess(res, user, "Lấy thông tin người dùng thành công.");
});

// Cập nhật thông tin người dùng
const updateUserInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, avatar, phone, address } = req.body;

  const user = await User.findById(userId).select("-password -passwordResetToken -token");

  if (!user) {
    throw new AppError("Tài khoản không tồn tại.", 404);
  }

  user.name = name;
  user.avatar = avatar;
  user.phone = phone;
  user.address = address;

  await user.save();

  return sendSuccess(res, user, "Cập nhật thông tin thành công.");
});

// Xóa tài khoản
const deleteMyAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Không tìm thấy người dùng.", 404);
  }

  // Xóa tài liệu
  await Document.deleteMany({
    uploaderId: userId,
  });

  // Xóa bình luận
  await Comment.deleteMany({
    userId,
  });

  // Xóa đánh giá
  await Rating.deleteMany({
    userId,
  });

  // Xóa user
  await User.deleteOne({
    _id: userId,
  });

  return sendSuccess(res, null, "Xóa tài khoản thành công.");
});

// Tạo thanh toán ZaloPay
const PaymentZaloPay = asyncHandler(async (req, res) => {
  const { price, numberDate } = req.body;

  const userId = req.user._id.toString();

  // Validation price
  if (price === undefined || typeof price !== "number" || price <= 0) {
    throw new AppError("Giá thanh toán không hợp lệ.", 400);
  }

  // Validation numberDate
  if (numberDate === undefined || !Number.isInteger(numberDate) || numberDate <= 0) {
    throw new AppError("Số tháng nâng cấp không hợp lệ.", 400);
  }

  const embed_data = {
    redirecturl: "http://localhost:5173",
  };

  const items = [{}];

  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.app_id,

    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,

    app_user: userId,

    app_time: Date.now(),

    item: JSON.stringify(items),

    embed_data: JSON.stringify(embed_data),

    amount: price,

    description: `Payment for the order #${transID}`,

    bank_code: "",

    callback_url:
      `https://6faf-14-191-240-204.ngrok-free.app` +
      `/api/v1/users/callback` +
      `?idUser=${userId}` +
      `&numberDate=${numberDate}`,
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const response = await axios.post(config.endpoint, null, {
    params: order,
  });

  return sendSuccess(res, response.data, "Tạo thanh toán thành công.");
});

// Callback từ ZaloPay
const CallBack = async (req, res) => {
  let result = {};

  const idUser = req.query.idUser;

  const numberDate = parseInt(req.query.numberDate, 10);

  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tạo MAC để xác thực callback
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // Xác thực callback từ ZaloPay
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";

      return res.json(result);
    }

    const dataJson = JSON.parse(dataStr);

    // Có thể sử dụng dataJson để kiểm tra
    // thông tin giao dịch nếu cần.
    console.log("ZaloPay callback data:", dataJson);

    // Kiểm tra user
    const user = await User.findById(idUser);

    if (!user) {
      result.return_code = 0;
      result.return_message = "Không tìm thấy người dùng";

      return res.json(result);
    }

    // Validation numberDate
    if (!Number.isInteger(numberDate) || numberDate <= 0) {
      result.return_code = 0;
      result.return_message = "Số tháng nâng cấp không hợp lệ";

      return res.json(result);
    }

    // Tính thời gian VIP
    const startDate = new Date();

    const endDate = new Date();

    endDate.setMonth(endDate.getMonth() + numberDate);

    // Nâng cấp tài khoản
    await User.findByIdAndUpdate(idUser, {
      isVip: "active",
      vipStartDate: startDate,
      vipEndDate: endDate,
      role: "uploader",
    });

    result.return_code = 1;
    result.return_message = "success";

    return res.json(result);
  } catch (error) {
    console.error("❌ Lỗi callback:", error);

    result.return_code = 0;
    result.return_message = error.message || "Lỗi callback";

    return res.json(result);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  deleteMyAccount,
  PaymentZaloPay,
  CallBack,
};
