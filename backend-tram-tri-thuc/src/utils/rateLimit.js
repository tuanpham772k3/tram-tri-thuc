// config/rateLimit.config.js
const rateLimit = require("express-rate-limit");

const createRateLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    handler: (req, res) => {
      console.log(`Rate limit reached for IP ${req.ip} on ${req.path}`);
      res.status(429).json({
        success: false,
        message,
      });
    },
  });

module.exports = {
  loginLimiter: createRateLimiter(
    15 * 60 * 1000, // 15 phút
    5,
    "Quá nhiều lần đăng nhập sai, vui lòng thử lại sau 15 phút."
  ),
  forgotPasswordLimiter: createRateLimiter(
    60 * 60 * 1000, // 1 giờ
    3,
    "Quá nhiều yêu cầu đặt lại mật khẩu, vui lòng thử lại sau 1 giờ."
  ),
  registerLimiter: createRateLimiter(
    60 * 60 * 1000, // 1 giờ
    10,
    "Quá nhiều yêu cầu đăng ký, vui lòng thử lại sau 1 giờ."
  ),

  downloadLimiter: createRateLimiter(
    60 * 60 * 1000, // 1 giờ
    20,
    "Bạn đã tải xuống quá nhiều tài liệu, vui lòng thử lại sau 1 giờ."
  ),

  // Middleware giới hạn số lượt gọi API cho đánh giá, bình luận, tải xuống
  commentLimiter: createRateLimiter(
    60 * 1000, // 1 phút
    5,
    "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 1 phút."
  ),
};
