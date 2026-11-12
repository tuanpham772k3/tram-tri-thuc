const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartSelection,
  clearCart,
} = require("../controller/cart.controller");

const router = express.Router();

router.get("/", authenticate, getCart);
router.post("/items", authenticate, addToCart);
router.delete("/items/:bookId", authenticate, removeFromCart);
router.patch("/items/:bookId/selection", authenticate, updateCartSelection);
router.delete("/", authenticate, clearCart);

module.exports = router;
