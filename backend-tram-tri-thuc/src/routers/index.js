// routes/index.js
const express = require("express");
const router = express.Router();
const documentRoutes = require("./document.routes");
// const shareRoutes = require("./share.routes");
const authRoutes = require("./auth.routes");
const usersRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const ratingCommentRoutes = require("./ratingComment.routes");
const statRoutes = require("./stat.routes");
const notificationRoutes = require("./notification.routes");
const searchRoutes = require("./search.routes");

// router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/", ratingCommentRoutes);
router.use("/search", searchRoutes);
// router.use("/share", shareRoutes);
router.use("/stats", statRoutes);
router.use("/users", usersRoutes);



module.exports = router;
