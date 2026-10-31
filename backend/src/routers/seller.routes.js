const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { isSeller } = require("../middlewares/role.middleware");
const uploadBookFiles = require("../middlewares/upload.middleware");
const { uploadNewBook } = require("../controller/seller.controller");

const router = express.Router();

// Đăng bán sách
router.post("/books", authenticate, uploadBookFiles, isSeller, uploadNewBook);

// // Lấy danh sách sách của seller
// router.get("/books", authenticate, isSeller, getSellerBooks);

// // Cập nhật thông tin sách theo ID
// router.patch("/books/:bookId", authenticate, isSeller, updateBookById);

// // Xóa sách theo ID
// router.delete("/books/:bookId", authenticate, isSeller, deleteBookById);

// // Lấy tổng quan (tổng doanh thu, số lượng sách đã bán, số lượng sách đang bán)
// router.get("/statistics/overview", authenticate, isSeller, getSellerOverview);

// // Lấy biểu đồ doanh thu
// router.get("/statistics/revenue-chart", authenticate, isSeller, getSellerRevenueChart);

// // Lấy danh sách đơn hàng
// router.get("/orders", authenticate, isSeller, getSellerOrders);

// // Lấy chi tiết đơn hàng
// router.get("/orders/:orderId", authenticate, isSeller, getSellerOrderById);

module.exports = router;
