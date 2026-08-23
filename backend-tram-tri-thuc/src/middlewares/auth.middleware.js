const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không có token. Vui lòng đăng nhập.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("_id email role isActive isVip");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      });
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVip: user.isVip,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
