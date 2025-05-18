const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    restoreDocument,
    permanentlyDeleteDocument,
    emptyTrash,
    getTrashItems,
} = require("../controller/trash.controller");

// Quản lý thùng rác
router.get("/", authMiddleware, getTrashItems);
router.delete("/:id", authMiddleware, permanentlyDeleteDocument);
router.patch("/:id", authMiddleware, restoreDocument);
router.delete("/", authMiddleware, emptyTrash);

module.exports = router;
