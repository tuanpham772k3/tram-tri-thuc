const express = require("express");
const router = express.Router();
const isUploader = require("../middlewares/isUploader");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const validate = require("../middlewares/validate");
const checkDocumentStatus = require("../middlewares/checkDocumentStatus");
const { body, param, query } = require("express-validator");
const {
    getDocuments,
    getDocumentById,
    getDocumentBySlug,
    downloadDocument,
    uploadDocument,
    getMyDocuments,
    updateDocument,
    deleteDocument,
    approveDocument,
    featureDocument,
    getFeaturedDocuments,
} = require("../controller/document.controller");
const { documentListLimiter } = require("../middlewares/rateLimit");

// Lấy danh sách tài liệu của người dùng hiện tại
router.get("/me", authMiddleware, isUploader, getMyDocuments);

//Lấy tài liệu nổi bật
router.get("/featured", getFeaturedDocuments);

// Lấy danh sách tài liệu với các tùy chọn lọc, phân trang, tìm kiếm
router.get(
    "/",
    [
        query("page").optional().isInt({ min: 1 }).toInt().withMessage("Invalid page number"),
        query("limit").optional().isInt({ min: 1, max: 100 }).toInt().withMessage("Invalid limit"),
        query("search")
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage("Search query too long"),
        query("category")
            .optional()
            .trim()
            .matches(/^[a-z0-9-]+$/)
            .withMessage("Invalid category slug"),
        query("uploader").optional().trim().isMongoId().withMessage("Invalid uploader ID"),
        query("sort")
            .optional()
            .matches(/^(views|downloads|createdAt):(asc|desc)$/)
            .withMessage("Invalid sort format (e.g., views:desc)"),
        validate,
    ],
    documentListLimiter,
    getDocuments
);

// Lấy thông tin chi tiết của tài liệu theo ID
router.get(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid document ID"), validate],
    async (req, res, next) => {
        req.document = await require("../models/document.model").findById(req.params.id);
        next();
    },
    checkDocumentStatus,
    getDocumentById
);

// Lấy thông tin chi tiết của tài liệu theo slug
router.get(
    "/slug/:slug",
    [
        param("slug")
            .notEmpty()
            .matches(/^[a-z0-9-]+$/)
            .withMessage("Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
        validate,
    ],
    async (req, res, next) => {
        req.document = await require("../models/document.model").findOne({ slug: req.params.slug });
        next();
    },
    checkDocumentStatus,
    getDocumentBySlug
);

// Tải xuống tài liệu theo ID
router.get(
    "/download/:id",
    [param("id").isMongoId().withMessage("Invalid document ID"), validate, authMiddleware],
    downloadDocument
);

// Tải lên tài liệu mới
router.post(
    "/",
    authMiddleware, // Yêu cầu xác thực người dùng
    isUploader, // Kiểm tra quyền của người tải lên
    uploadMiddleware, // Xử lý file tải lên
    [
        body("title").notEmpty().trim().withMessage("Title is required"), // Tiêu đề tài liệu
        body("description").optional().isLength({ max: 1000 }).withMessage("Description too long"),
        body("tag").optional().isString().withMessage("Tags must be a comma-separated string"),
        body("categoryId").isMongoId().withMessage("Invalid category ID"), // ID danh mục
        validate,
    ],
    uploadDocument
);

// Cập nhật thông tin tài liệu theo ID
router.patch(
    "/:id",
    authMiddleware, // Yêu cầu xác thực người dùng
    isUploader, // Kiểm tra quyền của người tải lên
    [
        param("id").isMongoId().withMessage("Invalid document ID"), // ID tài liệu
        body("title").optional().trim(), // Tiêu đề (tùy chọn)
        body("description").optional().trim(), // Mô tả (tùy chọn)
        body("categoryId").optional().isMongoId().withMessage("Invalid category ID"), // ID danh mục (tùy chọn)
        validate,
    ],
    updateDocument
);

// Xóa tài liệu theo ID
router.delete(
    "/:id",
    authMiddleware, // Yêu cầu xác thực người dùng
    isUploader, // Kiểm tra quyền của người tải lên
    [param("id").isMongoId().withMessage("Invalid document ID"), validate],
    deleteDocument
);

// Duyệt tài liệu (chỉ dành cho admin)
router.patch(
    "/approve/:id",
    authMiddleware, // Yêu cầu xác thực người dùng
    isAdmin, // Chỉ admin mới có quyền
    [param("id").isMongoId().withMessage("Invalid document ID"), validate],
    approveDocument
);

// Đánh dấu tài liệu là nổi bật (chỉ dành cho admin)
router.patch(
    "/feature/:id",
    authMiddleware, // Yêu cầu xác thực người dùng
    isAdmin, // Chỉ admin mới có quyền
    [param("id").isMongoId().withMessage("Invalid document ID"), validate],
    featureDocument
);

module.exports = router;
