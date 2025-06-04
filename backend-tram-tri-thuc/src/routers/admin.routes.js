const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { param, body, query } = require("express-validator");
const isAdmin = require("../middlewares/isAdmin");
const { getAllComments, forceDeleteComment } = require("../controller/admin.controller");

// Comment: Lấy toàn bộ bình luận
router.get(
    "/comments",
    authMiddleware,
    isAdmin,
    [
        query("isReported").optional().isBoolean().withMessage("isReported phải là boolean"),
        validate,
    ],
    getAllComments
);

// Comment: Xóa bình luận vi phạm
router.delete(
    "/comments/:commentId/force",
    authMiddleware,
    isAdmin,
    [param("commentId").isMongoId().withMessage("ID bình luận không hợp lệ"), validate],
    forceDeleteComment
);

module.exports = router;
