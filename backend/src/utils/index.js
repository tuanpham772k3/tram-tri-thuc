const express = require("express");

const authRoutes = require("../routers/auth.routes");
const userRoutes = require("../routers/user.routes");
const sellerRoutes = require("../routers/seller.routes");
const bookRoutes = require("../routers/book.routes");
const libraryRoutes = require("../routers/library.routes");
const cartRoutes = require("../routers/cart.routes");
const wishlistRoutes = require("../routers/wishlist.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/seller", sellerRoutes);
router.use("/books", bookRoutes);
router.use("/library", libraryRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
