const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const uploadBookFiles = require("../middlewares/upload.middleware");
const { isSeller } = require("../middlewares/role.middleware");
const {
  uploadNewBook,
  getSellerBooks,
  updateBookById,
  deleteBookById,
  getSellerOverview,
  getSellerRevenueChart,
  getSellerTopBooks,
  getSellerOrders,
  getSellerOrderById,
} = require("../controller/seller.controller");

const router = express.Router();

// Đăng bán sách
router.post("/books", authenticate, isSeller, uploadBookFiles, uploadNewBook);

// Lấy danh sách sách của seller
router.get("/books", authenticate, isSeller, getSellerBooks);

// Cập nhật thông tin sách theo ID
router.put("/books/:bookId", authenticate, isSeller, updateBookById);

// Xóa sách theo ID
router.delete("/books/:bookId", authenticate, isSeller, deleteBookById);

// Lấy tổng quan (tổng doanh thu, số lượng sách đã bán, số lượng sách đang bán)
router.get("/dashboard/overview", authenticate, isSeller, getSellerOverview);

// Lấy biểu đồ doanh thu (ngày , tháng, năm)
router.get("/dashboard/revenue-chart", authenticate, isSeller, getSellerRevenueChart);

// Lấy danh sách top 5 sách bán chạy nhất
router.get("/dashboard/top-books", authenticate, isSeller, getSellerTopBooks);

// Lấy danh sách đơn hàng
router.get("/orders", authenticate, isSeller, getSellerOrders);

// Lấy chi tiết đơn hàng
router.get("/orders/:orderId", authenticate, isSeller, getSellerOrderById);

module.exports = router;
