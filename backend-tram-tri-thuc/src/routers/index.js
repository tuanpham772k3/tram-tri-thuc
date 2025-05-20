// routes/index.js
const express = require("express");
const router = express.Router();
const documentRoutes = require("./document.routes");
// const shareRoutes = require("./share.routes");
const authRoutes = require("./auth.routes");
const usersRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const commentRoutes = require("./comment.routes");
const ratingRoutes = require("./rating.routes");
const statRoutes = require("./stat.routes");
const notificationRoutes = require("./notification.routes");
const searchRoutes = require("./search.routes");
// const adminRoutes = require("./admin.routes");


// router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/documents", documentRoutes);
// router.use("/share", shareRoutes);
router.use("/categories", categoryRoutes);
router.use("/comments", commentRoutes);
router.use("/ratings", ratingRoutes);
router.use("/stats", statRoutes);
router.use("/notifications", notificationRoutes);
router.use("/search", searchRoutes);


module.exports = router;
