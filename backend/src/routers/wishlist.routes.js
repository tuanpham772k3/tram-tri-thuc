const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getWishlist,
  addBookToWishlist,
  removeBookFromWishlist,
} = require("../controller/wishlist.controller");

const router = express.Router();

router.get("/", authenticate, getWishlist);
router.post("/items", authenticate, addBookToWishlist);
router.delete("/items/:bookId", authenticate, removeBookFromWishlist);

module.exports = router;
