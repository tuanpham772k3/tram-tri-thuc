const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getUserInfo,
  updateUserInfo,
  deleteMyAccount,
  CallBack,
  PaymentZaloPay,
} = require("../controller/user.controller");

const router = express.Router();

// Lấy thông tin cá nhân
router.get("/me", authenticate, getUserInfo);

// Cập nhật thông tin cá nhân
router.put("/me", authenticate, updateUserInfo);

// Xoá tài khoản
router.delete("/me", authenticate, deleteMyAccount);

// thanh toán
router.post("/paymentZaloPay", authenticate, PaymentZaloPay);

router.post("/callback", CallBack);

module.exports = router;
