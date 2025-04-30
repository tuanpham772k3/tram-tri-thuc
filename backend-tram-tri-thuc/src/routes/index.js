// routes/index.js
const express = require("express");
const router = express.Router();
const documentRoutes = require("./document.router");
const shareRoutes = require("./share.router");
const authRoutes = require("./auth.router");

router.use("/documents", documentRoutes);
router.use("/share", shareRoutes);
router.use("/auth", authRoutes);

module.exports = router;
