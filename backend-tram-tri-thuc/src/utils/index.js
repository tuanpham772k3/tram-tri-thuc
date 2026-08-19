// routes/index.js
const express = require("express");
const router = express.Router();

const documentRoutes = require("../routers/document.routes");
const adminRoutes = require("../routers/admin.routes");
const authRoutes = require("../routers/auth.routes");
const usersRoutes = require("../routers/user.routes");
const categoryRoutes = require("../routers/category.routes");
const ratingRoutes = require("../routers/rating.routes");
const commentRoutes = require("../routers/comment.routes");
const notificationRoutes = require("../routers/notification.routes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", usersRoutes);
router.use("/categories", categoryRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/ratings", ratingRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
