const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  addRating,
  getRatingsByDocument,
  updateRating,
  deleteRating,
} = require("../controller/rating.controller");

// Chấm sao
router.post("/", authMiddleware, addRating);

// Lấy đánh giá tài liệu
router.get("/:documentId", getRatingsByDocument);

// Cập nhật đánh giá
router.put("/:id", authMiddleware, updateRating);

// Xóa đánh giá
router.delete("/:id", authMiddleware, deleteRating);

module.exports = router;