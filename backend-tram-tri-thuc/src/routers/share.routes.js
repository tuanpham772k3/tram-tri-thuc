const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const documentPermission = require("../middlewares/documentPermission");

const {
    createShareLink,
    addPermission,
    getPermissions,
    removePermission,
} = require("../controller/share.controller");

// Tạo link chia sẻ
router.post("/:documentId/link", authMiddleware, createShareLink);

// Chia sẻ với người dùng cụ thể
router.post("/:documentId/user", authMiddleware, addPermission);

// Xem ai đang được chia sẻ
router.get("/:documentId", authMiddleware, getPermissions);

// Thu hồi quyền chia sẻ
router.delete("/:documentId/:userId", authMiddleware, removePermission);

module.exports = router;
