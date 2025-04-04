const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    uploadDocument,
    getDocuments,
} = require("../controller/document.controller");

// Route upload tài liệu
router.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
    console.log("Middleware upload:", req.file);
    uploadDocument(req, res);
});

// Route lấy danh sách tài liệu
router.get("/documents", authMiddleware, getDocuments);

module.exports = router;
