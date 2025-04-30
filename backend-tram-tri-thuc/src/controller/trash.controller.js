const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const TrashService = require("../services/trash.service");

// Validation schemas
const trashSchema = Joi.object({
    id: Joi.string().required(),
});

// Get deleted documents
const getTrashItems = async (req, res) => {
    try {
        const userId = req.user;
        const documents = await TrashService.getTrashItems(userId);
        return res.json({
            success: true,
            message: "Deleted documents retrieved successfully",
            data: { documents },
        });
    } catch (error) {
        console.error("Get Deleted Documents Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while retrieving deleted documents",
        });
    }
};

// Delete document temporarily to trash
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        const document = await TrashService.deleteDocument(id, userId);
        return res.json({
            success: true,
            message: "Document moved to trash",
            data: { document },
        });
    } catch (error) {
        console.error("Delete Document Error:", error.message);
        return res.status(error.message.includes("Invalid") ? 400 : 404).json({
            success: false,
            message: error.message || "Server error while moving to trash",
        });
    }
};

// Restore document from trash
const restoreDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        const document = await TrashService.restoreDocument(id, userId);
        return res.json({
            success: true,
            message: "Document restored successfully",
            data: { document },
        });
    } catch (error) {
        console.error("Restore Document Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while restoring document",
        });
    }
};

// Permanently delete document from trash
const permanentlyDeleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        await TrashService.permanentlyDeleteDocument(id, userId);
        return res.json({
            success: true,
            message: "Document permanently deleted",
        });
    } catch (error) {
        console.error("Permanently Delete Document Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while permanently deleting document",
        });
    }
};

// Empty trash
const emptyTrash = async (req, res) => {
    try {
        const userId = req.user;
        await TrashService.emptyTrash(userId);
        return res.json({
            success: true,
            message: "Trash emptied successfully",
        });
    } catch (error) {
        console.error("Empty Trash Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while emptying trash",
        });
    }
};

module.exports = {
    getTrashItems,
    deleteDocument,
    restoreDocument,
    permanentlyDeleteDocument,
    emptyTrash,
};
