const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
    createDownloadHistory,
    createViewHistory,
} = require("../controller/userHistory.controller");
const { body } = require("express-validator");

// Thêm vào lịch sử xem tài liệu
router.post(
    "/view/history",
    authMiddleware,
    // historyLimiter,
    [body("documentId").isMongoId().withMessage("ID tài liệu không hợp lệ"), validate],
    createViewHistory
);

module.exports = router;
