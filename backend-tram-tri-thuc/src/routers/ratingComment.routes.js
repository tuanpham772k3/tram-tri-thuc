const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const isAdmin = require("../middlewares/isAdmin");
const {
    createRating,
    getRatingsByDocument,
    updateRating,
    deleteRating,
    createComment,
    getCommentsByDocument,
    deleteComment,
    updateComment,
} = require("../controller/ratingComment.controller");
const { param, body } = require("express-validator");
const { commentLimiter } = require("../middlewares/rateLimit");

// Đánh giá tài liệu
router.post(
    "/ratings",
    authMiddleware,
    commentLimiter,
    [
        body("documentId").isMongoId().withMessage("ID tài liệu không hợp lệ"),
        body("stars").isInt({ min: 1, max: 5 }).withMessage("Số sao phải từ 1 đến 5"),
        validate,
    ],
    createRating
);

// Lấy danh sách đánh giá của tài liệu
router.get(
    "/documents/:id/ratings",
    [param("id").isMongoId().withMessage("ID tài liệu không hợp lệ"), validate],
    getRatingsByDocument
);

// Cập nhật đánh giá
router.put(
    "/ratings/:id",
    authMiddleware,
    commentLimiter,
    [
        param("id").isMongoId().withMessage("ID đánh giá không hợp lệ"),
        body("stars").isInt({ min: 1, max: 5 }).withMessage("Số sao phải từ 1 đến 5"),
        validate,
    ],
    updateRating
);

// Xoá đánh giá
router.delete(
    "/ratings/:id",
    authMiddleware,
    // isAdmin,
    [param("id").isMongoId().withMessage("ID đánh giá không hợp lệ"), validate],
    deleteRating
);

// Bình luận tài liệu
router.post(
    "/comments",
    authMiddleware,
    commentLimiter,
    [
        body("documentId").isMongoId().withMessage("ID tài liệu không hợp lệ"),
        body("content")
            .notEmpty()
            .trim()
            .isLength({ max: 500 })
            .withMessage("Bình luận không được rỗng và tối đa 500 ký tự"),
        body("parentCommentId").optional().isMongoId().withMessage("ID bình luận cha không hợp lệ"),
        validate,
    ],
    createComment
);

// Lấy danh sách bình luận của tài liệu
router.get(
    "/documents/:id/comments",
    [param("id").isMongoId().withMessage("ID tài liệu không hợp lệ"), validate],
    getCommentsByDocument
);

// Cập nhật bình luận
router.put(
    "/comments/:id",
    authMiddleware,
    commentLimiter,
    [
        param("id").isMongoId().withMessage("ID bình luận không hợp lệ"),
        body("content")
            .notEmpty()
            .trim()
            .isLength({ max: 500 })
            .withMessage("Bình luận không được rỗng và tối đa 500 ký tự"),
        validate,
    ],
    updateComment
);

// Xoá bình luận
router.delete(
    "/comments/:id",
    authMiddleware,
    [param("id").isMongoId().withMessage("ID bình luận không hợp lệ"), validate],
    deleteComment
);

module.exports = router;
