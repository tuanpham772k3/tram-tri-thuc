const express = require("express");
const {
  getBooks,
  getRelatedBooks,
  getBookById,
} = require("../controller/book.controller");

const router = express.Router();

// Public
router.get("/", getBooks);

// Chi tiết sách
router.get("/:bookId/related", getRelatedBooks);
router.get("/:bookId", getBookById);

module.exports = router;
