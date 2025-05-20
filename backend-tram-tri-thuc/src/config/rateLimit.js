// config/rateLimit.config.js
const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

const createRateLimiter = (windowMs, max, message) =>
    rateLimit({
        windowMs,
        max,
        handler: (req, res) => {
            logger.warn(`Rate limit reached for IP ${req.ip} on ${req.path}`);
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
        "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút."
    ),
    forgotPasswordLimiter: createRateLimiter(
        60 * 60 * 1000, // 1 giờ
        3,
        "Quá nhiều yêu cầu đặt lại mật khẩu, vui lòng thử lại sau 1 giờ."
    ),
    
    refreshTokenLimiter: createRateLimiter(
        15 * 60 * 1000, // 15 phút
        5,
        "Quá nhiều yêu cầu làm mới token, vui lòng thử lại sau."
    ),
};
