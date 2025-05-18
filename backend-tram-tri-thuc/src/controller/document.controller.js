const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const DocumentService = require("../services/document.service");
const fs = require("fs");
const logger = require("../utils/logger");

// Validation schemas
const folderSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    parentId: Joi.string().allow(null, "").optional(),
});

const uploadSchema = Joi.object({
    parentId: Joi.string().allow(null, "").optional(),
});

const renameSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    id: Joi.string().required(),
});

const moveSchema = Joi.object({
    newParentId: Joi.string().allow(null, "").optional(),
    id: Joi.string().required(),
});

const starSchema = Joi.object({
    id: Joi.string().required(),
});

// Validation schema cho query string
const filterSchema = Joi.object({
    type: Joi.string().valid("folder", "file").optional(),
    mimeType: Joi.string()
        .valid("pdf", "excel", "word", "image")
        .optional()
        .when("type", {
            is: "file",
            then: Joi.string().valid("pdf", "excel", "word", "image").optional(),
            otherwise: Joi.forbidden(),
        }),
    ownerEmail: Joi.string().email().optional(),
    from: Joi.date().iso().optional(),
    to: Joi.date().iso().optional(),
});

// Middleware để validate query
const validateFilterQuery = (req, res, next) => {
    const { error } = filterSchema.validate(req.query);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }
    next();
};

//Update file
const updateFile = async (req, res) => {
    const { id: documentId } = req.params;
    const userId = req.user;
    const file = req.file; // Giả sử dùng multer để upload file

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const document = await Document.findOne({ _id: documentId, userId });
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Cập nhật file trên Google Drive
        const response = await retryDriveRequest(
            drive.files.update({
                fileId: document.driveId,
                media: {
                    mimeType: file.mimetype,
                    body: require("fs").createReadStream(file.path),
                },
            }),
            "Failed to update file on Google Drive"
        );

        // Cập nhật metadata trong MongoDB
        document.url = `https://drive.google.com/file/d/${response.data.id}/view`;
        document.directUrl = `https://drive.google.com/uc?id=${response.data.id}`;
        document.mimeType = file.mimetype;
        document.size = file.size;
        await document.save();

        res.json({ success: true, message: "File updated successfully", data: document });
    } catch (error) {
        res.status(500).json({ message: "Failed to update file", error: error.message });
    }
};

// Create folder
const createFolder = [
    validateRequest(folderSchema),
    async (req, res) => {
        try {
            const { name, parentId } = req.body;
            const userId = req.user;
            const folder = await DocumentService.createFolder({ name, parentId, userId });
            res.json({
                success: true,
                message: "Folder created successfully",
                data: { folder },
            });
        } catch (error) {
            console.error("Create Folder Error:", error.message);
            res.status(500).json({
                success: false,
                message: error.message || "Server error while creating folder",
            });
        }
    },
];

// Upload document
const uploadDocument = [
    validateRequest(uploadSchema),
    async (req, res) => {
        try {
            const file = req.file;
            const { parentId } = req.body;
            const userId = req.user;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const fileData = await DocumentService.uploadDocument({ file, parentId, userId });
            res.json({
                success: true,
                message: "File uploaded successfully",
                data: { file: fileData },
            });
        } catch (error) {
            console.error("Upload Error:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Server error while uploading",
            });
        } finally {
            if (req.file) {
                try {
                    await fs.promises.unlink(req.file.path);
                    console.log("Temporary file deleted:", req.file.path);
                } catch (unlinkError) {
                    console.error("Error deleting temp file:", unlinkError.message);
                }
            }
        }
    },
];

// Get documents
const getDocuments = async (req, res) => {
    try {
        const { parentId, starred, includeChildren } = req.query;
        const userId = req.user;
        const documents = await DocumentService.getDocuments({
            parentId,
            starred,
            includeChildren,
            userId,
        });
        res.json({
            success: true,
            message: "Documents retrieved successfully",
            data: { documents },
        });
    } catch (error) {
        console.error("Get Documents Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while retrieving documents",
            data: { documents: [] },
        });
    }
};

// Rename document
const renameDocument = [
    validateRequest(renameSchema),
    async (req, res) => {
        try {
            const { id, name } = req.body;
            const userId = req.user;
            const document = await DocumentService.renameDocument({ id, name, userId });
            res.json({
                success: true,
                message: "Document renamed successfully",
                data: { document },
            });
        } catch (error) {
            console.error("Rename Document Error:", error.message);
            res.status(500).json({
                success: false,
                message: error.message || "Server error while renaming",
            });
        }
    },
];

// Star document
const starDocument = [
    validateRequest(starSchema),
    async (req, res) => {
        try {
            const { id } = req.body;
            const userId = req.user;
            const document = await DocumentService.starDocument({ id, userId });
            res.json({
                success: true,
                message: "Document star status updated",
                data: { document },
            });
        } catch (error) {
            console.error("Star Document Error:", error.message);
            res.status(500).json({
                success: false,
                message: "Server error while starring document",
            });
        }
    },
];

// Move document
const moveDocument = [
    validateRequest(moveSchema),
    async (req, res) => {
        try {
            const { id, newParentId } = req.body;
            const userId = req.user;
            const document = await DocumentService.moveDocument({ id, newParentId, userId });
            res.json({
                success: true,
                message: "Document moved successfully",
                data: { document },
            });
        } catch (error) {
            console.error("Move Document Error:", error.message);
            res.status(500).json({
                success: false,
                message: error.message || "Server error while moving document",
            });
        }
    },
];
const viewedDocument = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const userId = req.user;
        const document = await DocumentService.recordDocumentView({ documentId, userId });
        res.json({
            success: true,
            message: "View recorded successfully",
            data: { document },
        });
    } catch (error) {
        console.error("Record view error:", error.message);
        res.status(error.message.includes("not found") ? 404 : 500).json({
            success: false,
            message: error.message || "Server error while recording view",
        });
    }
};

// Controller để lọc tài liệu
const filterDocuments = async (req, res) => {
    try {
        const userId = req.user; // Lấy userId từ middleware auth
        const filters = {
            type: req.query.type,
            mimeType: req.query.mimeType,
            ownerEmail: req.query.ownerEmail,
            from: req.query.from,
            to: req.query.to,
        };

        const documents = await DocumentService.filterDocuments(userId, filters);

        return res.json({
            success: true,
            message: "Documents filtered successfully",
            data: { documents },
        });
    } catch (error) {
        logger.error("Filter Documents Error", { error: error.message });
        return res.status(error.message.includes("User not found") ? 404 : 500).json({
            success: false,
            message: error.message || "Server error while filtering documents",
        });
    }
};

module.exports = {
    updateFile,
    createFolder,
    uploadDocument,
    getDocuments,
    renameDocument,
    starDocument,
    moveDocument,
    viewedDocument,
    filterDocuments,
    validateFilterQuery,
};
