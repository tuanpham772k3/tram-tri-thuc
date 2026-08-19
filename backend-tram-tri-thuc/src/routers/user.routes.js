const express = require("express");
const {
  getUserInfo,
  updateUserInfo,
  deleteMyAccount,
  CallBack,
  PaymentZaloPay,
} = require("../controller/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Lấy thông tin cá nhân
router.get("/me", authMiddleware, getUserInfo);

// Cập nhật thông tin cá nhân
router.put("/me", authMiddleware, updateUserInfo);

// Xoá tài khoản
router.delete("/me", authMiddleware, deleteMyAccount);

// thanh toán
router.post("/paymentZaloPay", authMiddleware, PaymentZaloPay);

router.post("/callback", CallBack);

module.exports = router;
