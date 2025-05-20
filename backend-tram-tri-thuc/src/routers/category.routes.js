const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryDetail,
} = require("../controller/category.controller");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", getCategory); // Lấy danh sách danh mục
router.get("/:slug", getCategoryDetail); //tuỳ chọn nếu cần detail page


module.exports = router;
