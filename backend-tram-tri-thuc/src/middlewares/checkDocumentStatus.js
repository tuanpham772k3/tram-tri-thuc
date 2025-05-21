const logger = require("../utils/logger");

const checkDocumentStatus = (req, res, next) => {
    if (!req.document) {
        return res.status(404).json({ success: false, message: "Tài liệu không tồn tại." });
    }
    if (
        req.document.status === "approved" ||
        req.user?.role === "admin" ||
        req.document.uploaderId.equals(req.user?._id)
    ) {
        return next();
    }
    logger.warn("Access denied to unapproved document", {
        documentId: req.document._id,
        user: req.user,
    });
    return res.status(403).json({ success: false, message: "Tài liệu chưa được duyệt." });
};

module.exports = checkDocumentStatus;
