const { Types } = require("mongoose");
const UserService = require("../services/user.service");
const express = require("express"); // npm install express
const bodyParser = require("body-parser"); // npm install body-parser
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const User = require("../models/user.model");
async function getUsers(req, res) {
  try {
    const users = await UserService.getUsers(req.query);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Lấy danh sách người dùng thành công",
      data: users,
    });
  } catch (error) {
    console.log("Lỗi getUsers:", error);
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message || "Lỗi khi lấy danh sách người dùng",
    });
  }
}

async function getUserInfo(req, res) {
  try {
    const user = await UserService.getUserInfo(req.user._id);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  } catch (error) {
    console.log("Lỗi getUserInfo:", error);
    return res.status(404).json({
      success: false,
      status: 404,
      message: error.message || "Không tìm thấy người dùng",
    });
  }
}

async function updateUserInfo(req, res) {
  try {
    const user = await UserService.updateUserInfo(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Cập nhật thông tin thành công",
      data: user,
    });
  } catch (error) {
    console.log("Lỗi updateUserInfo:", error);
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message || "Lỗi khi cập nhật thông tin",
    });
  }
}

async function deleteMyAccount(req, res) {
  try {
    await UserService.deleteMyAccount(req.user._id);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Xóa tài khoản thành công",
      data: null,
    });
  } catch (error) {
    console.log("Lỗi deleteMyAccount:", error);
    return res.status(404).json({
      success: false,
      status: 404,
      message: error.message || "Không tìm thấy người dùng",
    });
  }
}

async function getUserHistory(req, res) {
  try {
    const history = await UserService.getUserHistory(req.user._id, req.query);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Lấy lịch sử xem tài liệu thành công",
      data: history,
    });
  } catch (error) {
    console.log("Lỗi getUserHistory:", error);
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message || "Lỗi khi lấy lịch sử xem",
    });
  }
}

async function getUserFavorites(req, res) {
  try {
    const favorites = await UserService.getUserFavorites(req.user._id, req.query);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Lấy danh sách tài liệu yêu thích thành công",
      data: favorites,
    });
  } catch (error) {
    console.log("Lỗi getUserFavorites:", error);
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message || "Lỗi khi lấy danh sách yêu thích",
    });
  }
}

async function getUserDownloads(req, res) {
  try {
    const downloads = await UserService.getUserDownloads(req.user._id, req.query);
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Lấy lịch sử tải tài liệu thành công",
      data: downloads,
    });
  } catch (error) {
    console.log("Lỗi getUserDownloads:", error);
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message || "Lỗi khi lấy lịch sử tải",
    });
  }
}

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
async function PaymentZaloPay(req, res) {
  const price = req.body.price;
  const numberDate = req.body.numberDate;

  const { _id } = req.user; // đây chính là user mà middleware đã gắn
  const idUser = _id.toString();
  console.log("User đang đăng nhập:", idUser);
  console.log(" check thông tin  numberDates ", numberDate);

  console.log(" check thông tin ", price);

  const embed_data = { redirecturl: "http://localhost:5173" };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: price,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url: `https://6faf-14-191-240-204.ngrok-free.app/api/v1/users/callback?idUser=${idUser}&numberDate=${numberDate}`,
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

  try {
    const response = await axios.post(config.endpoint, null, { params: order });
    return res.status(200).json({
      message: "Tạo thanh toán thành công",
      response: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Tạo thanh toán thất bại",
      error: error.response?.data || error.message,
    });
  }
}

async function CallBack(req, res) {
  let result = {};
  const idUser = req.query.idUser; // Lấy id từ query string
  const numberDate = parseInt(req.query.numberDate); // Lấy số tháng từ query string và chuyển sang số nguyên
  console.log("check 1  idUser", idUser);
  console.log("check 2 numberDate", numberDate);

  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // Xác thực callback từ ZaloPay
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      const dataJson = JSON.parse(dataStr);

      try {
        // Tìm và cập nhật user
        const user = await User.findById(idUser);
        if (!user) {
          result.return_code = 0;
          result.return_message = "Không tìm thấy người dùng";
        } else {
          // Cập nhật trạng thái VIP
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + numberDate); // Tính ngày hết hạn dựa trên numberDate

          await User.findByIdAndUpdate(idUser, {
            isVip: "active",
            vipStartDate: startDate,
            vipEndDate: endDate,
            role: "uploader",
          });

          result.return_code = 1;
          result.return_message = "success";
        }
      } catch (err) {
        console.error("❌ Lỗi khi nâng cấp tài khoản:", err);
        result.return_code = 0;
        result.return_message = "Lỗi nâng cấp tài khoản";
      }
    }
  } catch (ex) {
    console.error("❌ Lỗi callback:", ex);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  // Trả về kết quả theo định dạng ZaloPay yêu cầu
  res.json(result);
}

module.exports = {
  getUsers,
  getUserInfo,
  updateUserInfo,
  deleteMyAccount,
  getUserHistory,
  getUserFavorites,
  getUserDownloads,
  PaymentZaloPay,
  CallBack,
};
