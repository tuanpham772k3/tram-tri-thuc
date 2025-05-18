const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const ShareService = require("../services/share.service");
const logger = require("../utils/logger");

// Validation schemas
const shareLinkSchema = Joi.object({
    permission: Joi.string().valid("viewer", "editor").required(),
    expiresInDays: Joi.number().integer().min(1).optional(),
}).strict(); // Từ chối trường thừa

const permissionSchema = Joi.object({
    email: Joi.string().email().max(254).optional().messages({
        "string.email": "Email không hợp lệ",
        "string.max": "Email không được vượt quá 254 ký tự",
    }),
    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
            "string.pattern.base": "userId phải là ObjectId hợp lệ",
        }),
    permission: Joi.string().valid("viewer", "editor").required().messages({
        "any.only": "Quyền phải là 'viewer' hoặc 'editor'",
        "any.required": "Quyền là bắt buộc",
    }),
})
    .or("email", "userId")
    .messages({
        "object.missing": "Phải cung cấp email hoặc userId",
    });

const removePermissionSchema = Joi.object({
    userId: Joi.string().required(),
});

const createShareLink = [
    validateRequest(shareLinkSchema),
    async (req, res) => {
        try {
            const { permission, expiresInDays } = req.body;
            const { id: documentId } = req.params;
            const userId = req.user;

            const data = await ShareService.createShareLink(
                documentId,
                userId,
                permission,
                expiresInDays
            );

            logger.info("Create share link response", { documentId, userId, link: data.link });

            res.json({
                success: true,
                message: "Share link created successfully",
                data,
            });
        } catch (error) {
            logger.error("Create Share Link Error", {
                documentId: req.params.id,
                userId: req.user,
                error: error.message,
            });
            res.status(error.message.includes("Invalid") ? 400 : 500).json({
                success: false,
                message: error.message || "Server error while creating share link",
            });
        }
    },
];

const getShareLink = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const userId = req.user;

        const data = await ShareService.getShareLink(documentId, userId);

        res.json({
            success: true,
            message: data ? "Lấy link chia sẻ thành công" : "Chưa có link chia sẻ",
            data: data || null,
        });
    } catch (error) {
        logger.error("Get Share Link Error", {
            documentId: req.params.id,
            userId: req.user,
            error: error.message,
        });

        res.status(error.message.includes("Invalid") ? 400 : 404).json({
            success: false,
            message: error.message || "Server error while retrieving share link",
        });
    }
};

const deleteShareLink = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const userId = req.user;

        await ShareService.deleteShareLink(documentId, userId);

        res.json({
            success: true,
            message: "Share link deleted successfully",
            data: {},
        });
    } catch (error) {
        logger.error("Delete Share Link Error", {
            documentId: req.params.id,
            userId: req.user,
            error: error.message,
        });
        res.status(error.message.includes("Invalid") ? 400 : 404).json({
            success: false,
            message: error.message || "Server error while deleting share link",
        });
    }
};

const getSharedWithMe = async (req, res) => {
    try {
        const userId = req.user;

        const documents = await ShareService.getSharedWithMe(userId);

        res.json({
            success: true,
            message: "Shared documents fetched successfully",
            data: documents,
        });
    } catch (error) {
        logger.error("Get Shared With Me Error", {
            userId: req.user,
            error: error.message,
        });
        res.status(
            error.message.includes("Invalid") || error.message.includes("not found") ? 404 : 500
        ).json({
            success: false,
            message: error.message || "Server error while fetching shared documents",
        });
    }
};

const addPermission = [
    validateRequest(permissionSchema),
    async (req, res) => {
        try {
            const { email, userId: targetUserId, permission } = req.body;
            const { id: documentId } = req.params;
            const userId = req.user;

            const sharedWith = await ShareService.addPermission(documentId, userId, {
                email,
                userId: targetUserId,
                permission,
            });

            logger.info("Add permission response", {
                documentId,
                userId,
                targetEmail:
                    email || sharedWith.find((item) => item.userId === targetUserId)?.email,
            });

            res.json({
                success: true,
                message: "Permission added successfully",
                data: { sharedWith },
            });
        } catch (error) {
            logger.error("Add Permission Error", {
                documentId: req.params.id,
                userId: req.user,
                error: error.message,
            });

            res.status(error.message.includes("Invalid") ? 400 : 404).json({
                success: false,
                message: error.message || "Server error while adding permission",
            });
        }
    },
];

const getPermissions = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const userId = req.user;

        const sharedWith = await ShareService.getPermissions(documentId, userId);

        res.json({
            success: true,
            message: "Permissions retrieved successfully",
            data: { sharedWith },
        });
    } catch (error) {
        logger.error("Get Permissions Error", {
            documentId: req.params.id,
            userId: req.user,
            error: error.message,
        });
        res.status(error.message.includes("Invalid") ? 400 : 404).json({
            success: false,
            message: error.message || "Server error while retrieving permissions",
        });
    }
};

const removePermission = [
    validateRequest(removePermissionSchema),
    async (req, res) => {
        try {
            const { id: documentId, userId: targetUserId } = req.params;
            const userId = req.user;
            logger.info("Remove permission request", {
                documentId,
                userId,
                targetUserId,
            });
            const sharedWith = await ShareService.removePermission(
                documentId,
                userId,
                targetUserId
            );
            logger.info("Remove permission response", {
                documentId,
                userId,
                targetUserId,
            });
            res.json({
                success: true,
                message: "Permission removed successfully",
                data: { sharedWith },
            });
        } catch (error) {
            logger.error("Remove Permission Error", {
                documentId: req.params.id,
                userId: req.user,
                targetUserId: req.params.userId,
                error: error.message,
            });
            res.status(error.message.includes("Invalid") ? 400 : 404).json({
                success: false,
                message: error.message || "Server error while removing permission",
            });
        }
    },
];

const getSharedDocument = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const userId = req.user;

        const data = await ShareService.getSharedDocument(documentId, userId);

        res.json({
            success: true,
            message: "Shared document accessed successfully",
            data,
        });
    } catch (error) {
        logger.error("Get Shared Document Error", {
            documentId: req.params.id,
            userId: req.user,
            error: error.message,
        });
        res.status(
            error.message.includes("Invalid") || error.message.includes("not found") ? 404 : 500
        ).json({
            success: false,
            message: error.message || "Server error while accessing shared document",
        });
    }
};

const editDocument = async (req, res) => {
    try {
        const { id: documentId } = req.params;
        const userId = req.user;
        const file = req.file;

        if (!file) {
            logger.error("No file provided for edit", { documentId, userId });
            return res.status(400).json({
                success: false,
                message: "Không có file được gửi lên",
            });
        }

        const data = await ShareService.editDocument(documentId, userId, file);

        logger.info("Edit document response", { documentId, userId, fileName: file.originalname });

        res.json({
            success: true,
            message: "Tài liệu đã được chỉnh sửa thành công",
            data,
        });
    } catch (error) {
        logger.error("Edit Document Error", {
            documentId: req.params.id,
            userId: req.user,
            error: error.message,
        });
        res.status(
            error.message.includes("Invalid") || error.message.includes("not found")
                ? 404
                : error.message.includes("permission")
                  ? 403
                  : 400
        ).json({
            success: false,
            message: error.message || "Lỗi server khi chỉnh sửa tài liệu",
        });
    }
};

module.exports = {
    createShareLink,
    getShareLink,
    deleteShareLink,
    getSharedWithMe,
    addPermission,
    getPermissions,
    removePermission,
    getSharedDocument,
    editDocument,
};
