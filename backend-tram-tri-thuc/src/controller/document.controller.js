const Document = require("../models/Document.model");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

// GET /documents?search=&category=&sort=&page=
const getDocuments = async (req, res) => {
    try {
        const { search, category, sort = "-createdAt", page = 1, limit = 10 } = req.query;
        const query = { isApproved: true };
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (category) {
            query.categoryId = category;
        }

        const documents = await Document.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("uploaderId", "name")
            .lean();

        const total = await Document.countDocuments(query);

        return res.json({
            success: true,
            message: "Documents retrieved successfully",
            data: documents,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
            },
        });
    } catch (error) {
        logger.error("Get Documents Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while retrieving documents",
        });
    }
};

// GET /documents/:id
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id).populate("uploaderId", "name").lean();
        if (!document || !document.isApproved) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not approved",
            });
        }

        return res.json({
            success: true,
            message: "Document retrieved successfully",
            data: document,
        });
    } catch (error) {
        logger.error("Get Document By ID Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while retrieving document",
        });
    }
};

// GET /documents/:id/download
const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        if (!document || !document.isApproved) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not approved",
            });
        }

        document.downloadCount += 1;
        await document.save();

        return res.redirect(document.fileUrl);
    } catch (error) {
        logger.error("Download Document Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while downloading document",
        });
    }
};

// GET /documents/:id/view
const viewedDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        if (!document || !document.isApproved) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not approved",
            });
        }

        document.viewCount += 1;
        await document.save();

        return res.json({
            success: true,
            message: "View count updated",
        });
    } catch (error) {
        logger.error("View Document Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while updating view count",
        });
    }
};

// GET /documents/my
const getMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ uploaderId: req.user._id })
            .sort("-createdAt")
            .lean();
        return res.json({
            success: true,
            message: "My documents retrieved successfully",
            data: documents,
        });
    } catch (error) {
        logger.error("Get My Documents Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while retrieving your documents",
        });
    }
};

// POST /documents
const uploadDocument = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required",
            });
        }

        const document = new Document({
            title,
            description,
            fileUrl: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploaderId: req.user._id,
            categoryId,
            isApproved: true, // Tạm auto approve
        });

        await document.save();

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            data: document,
        });
    } catch (error) {
        logger.error("Upload Document Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while uploading document",
        });
    }
};

// PUT /documents/:id
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const document = await Document.findOneAndUpdate(
            { _id: id, uploaderId: req.user._id },
            updates,
            { new: true, runValidators: true }
        ).lean();

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or permission denied",
            });
        }

        return res.json({
            success: true,
            message: "Document updated successfully",
            data: document,
        });
    } catch (error) {
        logger.error("Update Document Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while updating document",
        });
    }
};

// DELETE /documents/:id
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findOneAndDelete({
            _id: id,
            uploaderId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or permission denied",
            });
        }

        // Optional: Delete physical file
        // fs.unlinkSync(path.resolve(document.fileUrl));

        return res.json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        logger.error("Delete Document Error", { error: error.message });
        return res.status(500).json({
            success: false,
            message: "Server error while deleting document",
        });
    }
};

module.exports = {
    getDocuments,
    getDocumentById,
    downloadDocument,
    viewedDocument,
    getMyDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
};
