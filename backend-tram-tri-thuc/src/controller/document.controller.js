const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const DocumentService = require("../services/document.service");
const fs = require("fs");

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

module.exports = {
    createFolder,
    uploadDocument,
    getDocuments,
    renameDocument,
    starDocument,
    moveDocument,
};
