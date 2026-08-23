const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
const {
  getViewStatsByMonth,
  getUsersWithPagination,
  getDocuments,
  approveDocument,
  rejectDocument,
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateDocumentFeatured,
  getSystemStats,
} = require("../controller/admin.controller");

const router = express.Router();

//  thống kê lượt xem hằng tháng
router.get("/viewstatistics", authenticate, isAdmin, getViewStatsByMonth);
router.get("/totalinfo", authenticate, isAdmin, getSystemStats);

// lấy danh sách người dùng
router.get("/users", authenticate, isAdmin, getUsersWithPagination);

// lấy tất cả các tài liệu
router.get("/document", authenticate, isAdmin, getDocuments);
router.put("/approveDocument", authenticate, isAdmin, approveDocument);
router.put("/rejectDocument", authenticate, isAdmin, rejectDocument);

// Category
router.post("/categories", authenticate, isAdmin, createCategory);
router.get("/categories", authenticate, isAdmin, getCategories);
router.get("/categories/:categoryId", authenticate, isAdmin, getCategoryById);
router.put("/categories/:categoryId", authenticate, isAdmin, updateCategory);
router.delete("/categories/:categoryId", authenticate, isAdmin, deleteCategory);

module.exports = router;
