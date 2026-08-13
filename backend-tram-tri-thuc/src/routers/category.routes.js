const express = require("express");
const router = express.Router();
const { getCategories, getCategoryBySlug } = require("../controller/category.controller");
const { categoryListLimiter } = require("../utils/rateLimit");

// Lấy danh sách tất cả danh mục
router.get("/", categoryListLimiter, getCategories);

// Lấy thông tin chi tiết của danh mục theo slug
router.get("/:slug", getCategoryBySlug);

module.exports = router;
