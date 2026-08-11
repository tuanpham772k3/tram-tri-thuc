// routes/index.js
const express = require("express");
const router = express.Router();
const documentRoutes = require("../routers/document.routes");
const adminRoutes = require("../routers/admin.routes");
const authRoutes = require("../routers/auth.routes");
const usersRoutes = require("../routers/user.routes");
const categoryRoutes = require("../routers/category.routes");
const ratingCommentRoutes = require("../routers/ratingComment.routes");
const notificationRoutes = require("../routers/notification.routes");

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/documents", documentRoutes);
router.use("/", notificationRoutes);
router.use("/", ratingCommentRoutes);
router.use("/users", usersRoutes);



module.exports = router;
