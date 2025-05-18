const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User.model");

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Không có token, không được phép" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("_id isActive");
        if (!user || !user.isActive) {
            return res
                .status(403)
                .json({ message: "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa" });
        }
        req.user = user._id;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

module.exports = authMiddleware;
