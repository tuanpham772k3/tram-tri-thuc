const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const User = require("../models/user.model");
const Rating = require("../models/rating.model");

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

async function getUserInfo(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -passwordResetToken -token")
      .lean();

    if (!user) {
      throw new Error("Tài khoản không tồn tại");
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "Không tìm thấy người dùng",
    });
  }
}

async function updateUserInfo(req, res) {
  try {
    const userId = req.user._id;
    const { name, avatar, phone, address } = req.body;

    const user = await User.findById(userId).select(
      "-password -passwordResetToken -token"
    );

    if (!user) {
      throw new Error("Tài khoản không tồn tại.");
    }

    user.name = name;
    user.avatar = avatar;
    user.phone = phone;
    user.address = address;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật thông tin",
    });
  }
}

async function deleteMyAccount(req, res) {
  try {
    const userId = req.user._id;

    // Xóa tài liệu
    await Document.deleteMany({ uploaderId: userId });

    // Xóa bình luận
    await Comment.deleteMany({ userId });

    // Xóa đánh giá
    await Rating.deleteMany({ userId });

    // Xóa user
    await User.deleteOne({ _id: userId });

    return res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công",
      data: null,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "Không tìm thấy người dùng",
    });
  }
}

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
  getUserInfo,
  updateUserInfo,
  deleteMyAccount,
  PaymentZaloPay,
  CallBack,
};
