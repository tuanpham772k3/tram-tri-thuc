const express = require("express");

const authRoutes = require("../routers/auth.routes");
const userRoutes = require("../routers/user.routes");
const sellerRoutes = require("../routers/seller.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/seller", sellerRoutes);

module.exports = router;
