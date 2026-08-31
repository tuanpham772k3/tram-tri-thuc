const express = require("express");

const authRoutes = require("../routers/auth.routes");
const adminRoutes = require("../routers/admin.routes");
const usersRoutes = require("../routers/user.routes");
const uploaderRoutes = require("../routers/uploader.routes");
const documentRoutes = require("../routers/document.routes");
const categoryRoutes = require("../routers/category.routes");
const ratingRoutes = require("../routers/rating.routes");
const commentRoutes = require("../routers/comment.routes");
const notificationRoutes = require("../routers/notification.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", usersRoutes);
router.use("/documents", uploaderRoutes);
router.use("/documents", documentRoutes);
router.use("/categories", categoryRoutes);
router.use("/ratings", ratingRoutes);
router.use("/comments", commentRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
