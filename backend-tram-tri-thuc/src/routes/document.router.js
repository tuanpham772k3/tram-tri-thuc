const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");

const {
    uploadDocument,
    getDocuments,
    renameDocument,
    createFolder,
    starDocument,
    moveDocument,
} = require("../controller/document.controller");
const {
    deleteDocument,
    restoreDocument,
    permanentlyDeleteDocument,
    emptyTrash,
    getTrashItems,
} = require("../controller/trash.controller");
const {
    createShareLink,
    getShareLink,
    deleteShareLink,
    getPermissions,
    removePermission,
    getSharedWithMe,
    addPermission,
} = require("../controller/share.controller");

const documentPermission = require("../middlewares/documentPermission");
const authMiddleware = require("../middlewares/authMiddleware");

// Tài liệu cơ bản
router.get("/documents", authMiddleware, getDocuments);
router.post("/documents", authMiddleware, upload.single("file"), uploadDocument);
router.put("/documents/:id", authMiddleware, renameDocument);

// Thư mục
router.post("/folders", authMiddleware, createFolder);

// Hành động đặc biệt cho tài liệu
router.patch("/documents/:id/star", authMiddleware, starDocument);
router.patch("/documents/:id/move", authMiddleware, moveDocument);

// Quản lý thùng rác
router.delete("/documents/:id", authMiddleware, deleteDocument);
router.get("/trash", authMiddleware, getTrashItems);
router.patch("/trash/:id", authMiddleware, restoreDocument);
router.delete("/trash/:id", authMiddleware, permanentlyDeleteDocument);
router.delete("/trash", authMiddleware, emptyTrash);

//-------------------------------------------------------------------

// Chia sẻ qua liên kết
router.post("/documents/:id/share-link", authMiddleware, createShareLink);
router.get("/documents/:id/share-link", authMiddleware, getShareLink);
router.delete("/documents/:id/share-link", authMiddleware, deleteShareLink);

// Chia sẻ với người dùng cụ thể
router.get("/documents/shared-with-me", authMiddleware, getSharedWithMe);
router.post("/documents/:id/permissions", authMiddleware, addPermission);
router.get("/documents/:id/permissions", authMiddleware, getPermissions);
router.delete("/documents/:id/permissions/:userId", authMiddleware, removePermission);

// Truy cập tài liệu được chia sẻ
router.get("/share/:linkId/:secretKey", documentPermission, async (req, res) => {
    const { document, permission } = req;
    res.json({
        success: true,
        message: "Document accessed successfully",
        data: {
            document: {
                _id: document._id,
                name: document.name,
                type: document.type,
                url: document.url,
                directUrl: document.directUrl,
                mimeType: document.mimeType,
                previewUrl: document.share.previewUrl,
            },
            permission,
        },
    });
});

module.exports = router;
