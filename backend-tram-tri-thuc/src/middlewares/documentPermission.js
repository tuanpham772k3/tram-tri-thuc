const Document = require("../models/Document.model");

const documentPermission = async (req, res, next) => {
    try {
        const { linkId, secretKey } = req.params;

        // Tìm document bằng share.linkId
        const document = await Document.findOne({
            "share.linkId": linkId,
            "share.secretKey": secretKey,
            deleted: false,
        });
        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or has been deleted",
            });
        }

        // Kiểm tra thời hạn link
        if (
            document.share?.linkPermission &&
            document.share.expiryDate &&
            new Date() > document.share.expiryDate
        ) {
            return res.status(403).json({
                success: false,
                message: "Share link has expired",
            });
        }

        // Kiểm tra nếu có link sharing
        if (document.share?.linkPermission) {
            req.document = document;
            req.permission = document.share.linkPermission;
            return next();
        }

        // Kiểm tra nếu user đã đăng nhập có quyền truy cập
        const userId = req.user;
        if (userId) {
            const user = await User.findById(userId).select("email");
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Nếu là owner
            if (document.userId.toString() === userId) {
                req.document = document;
                req.permission = "owner";
                return next();
            }

            const userAccess = document.share?.sharedWith?.find(
                (item) => item.userId?.toString() === userId || item.email === user.email
            );

            if (userAccess) {
                req.document = document;
                req.permission = userAccess.permission;
                return next();
            }
        }

        // Nếu không có quyền, trả về 403
        return res.status(403).json({
            success: false,
            message: "You don't have permission to access this document",
        });
    } catch (error) {
        console.error("Document Permission Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while checking document permissions",
        });
    }
};

module.exports = documentPermission;
