const Download = require("../models/Download.model");
const ViewHistory = require("../models/ViewHistory.model");
const Document = require("../models/Document.model");
const logger = require("../utils/logger");

// Lưu lịch sử xem tài liệu
exports.createViewHistory = async (req, res) => {
    try {
        const { documentId } = req.body;
        const userId = req.user._id;

        const document = await Document.findById(documentId);
        if (!document || document.status !== "approved") {
            return res.status(404).json({
                success: false,
                message: "Tài liệu không tồn tại hoặc chưa được duyệt.",
            });
        }

        const viewHistory = new ViewHistory({
            userId,
            documentId,
        });

        await viewHistory.save();
        logger.info(`View history created for user ${req.user.email}, document ${documentId}`);
        res.status(201).json({
            success: true,
            message: "Lưu lịch sử xem thành công.",
            data: viewHistory,
        });
    } catch (error) {
        logger.error(`Create view history error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Không thể lưu lịch sử xem.",
        });
    }
};
