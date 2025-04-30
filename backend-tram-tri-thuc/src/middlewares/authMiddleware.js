const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const authMiddleware = (req, res, next) => {
    // if (req.path.startsWith('/share/')) {
    //     req.user = null; // Không yêu cầu token
    //     return next();
    // }

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Không có token, không được phép" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Gắn userId vào req
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

module.exports = authMiddleware;
