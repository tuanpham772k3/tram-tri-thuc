const express = require("express");
const router = express.Router();
const { getCategories, getCategoryBySlug } = require("../controller/category.controller");
const { categoryListLimiter } = require("../utils/rateLimit");

// Lấy danh sách tất cả danh mục
router.get("/", categoryListLimiter, getCategories);

// Lấy thông tin chi tiết của danh mục theo slug
router.get("/:slug", getCategoryBySlug);

// // Tạo mới một danh mục (chỉ dành cho admin)
// router.post("/", authMiddleware, isAdmin, createCategory);
// // Cập nhật thông tin danh mục theo ID (chỉ dành cho admin)
// router.patch("/:id", authMiddleware, isAdmin, updateCategory);
// // Xóa danh mục theo ID (chỉ dành cho admin)
// router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
