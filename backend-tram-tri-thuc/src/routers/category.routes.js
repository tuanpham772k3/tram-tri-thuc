const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const isAdmin = require("../middlewares/isAdmin");

// Lấy danh sách danh mục
router.get("/", authMiddleware, getCategory);

// Tạo danh mục mới (chỉ admin)
router.post("/", authMiddleware, isAdmin, createCategory);

// Cập nhật danh mục (chỉ admin)
router.put("/:id", authMiddleware, isAdmin, updateCategory);

// Xoá danh mục (chỉ admin)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;