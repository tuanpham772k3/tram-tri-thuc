const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Lấy danh sách người dùng (chỉ admin)
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const user = await mongoose.model("User").findById(req.user);
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: { code: "ERR_FORBIDDEN", message: "Only admins can access this resource" },
            });
        }

        const users = await mongoose
            .model("User")
            .find({ isActive: true })
            .select("name email role isActive createdAt")
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await mongoose.model("User").countDocuments({ isActive: true });

        return res.json({
            success: true,
            message: "Users retrieved successfully",
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        logger.error("Get Users Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: { code: "ERR_SERVER", message: "Server error while retrieving users" },
        });
    }
};

// Lấy thông tin cá nhân
const getUserInfo = async (req, res) => {
    try {
        const user = await mongoose
            .model("User")
            .findOne({ _id: req.user, isActive: true })
            .select(
                "-password -resetToken -resetTokenExpires -emailVerificationToken -emailVerificationTokenExpires"
            )
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_USER_NOT_FOUND", message: "User not found" },
            });
        }
        return res.json({
            success: true,
            message: "User info retrieved successfully",
            data: { user },
        });
    } catch (error) {
        logger.error("Get User Info Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: { code: "ERR_SERVER", message: "Server error while retrieving user info" },
        });
    }
};

// Cập nhật thông tin cá nhân
const updateUserInfo = async (req, res) => {
    try {
        const updates = req.body;
        // Loại bỏ các trường không được phép cập nhật
        const allowedUpdates = ["name", "avatar"];
        const updateKeys = Object.keys(updates);
        const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate || updateKeys.length === 0) {
            return res.status(400).json({
                success: false,
                error: { code: "ERR_INVALID_UPDATE", message: "Invalid or empty update fields" },
            });
        }

        const user = await mongoose
            .model("User")
            .findByIdAndUpdate(req.user, updates, { new: true, runValidators: true })
            .select(
                "-password -resetToken -resetTokenExpires -emailVerificationToken -emailVerificationTokenExpires"
            )
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_USER_NOT_FOUND", message: "User not found" },
            });
        }
        return res.json({
            success: true,
            message: "User info updated successfully",
            data: { user },
        });
    } catch (error) {
        logger.error("Update User Info Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: { code: "ERR_SERVER", message: "Server error while updating user info" },
        });
    }
};

// Lịch sử xem tài liệu
const getUserHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const user = await mongoose
            .model("User")
            .findById(req.user, "recentViews")
            .populate({
                path: "recentViews.documentId",
                select: "title slug",
                match: { isActive: true },
            })
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_USER_NOT_FOUND", message: "User not found" },
            });
        }

        const history = user.recentViews
            .filter((view) => view.documentId) // Loại bỏ các documentId không tồn tại
            .slice(skip, skip + parseInt(limit))
            .sort((a, b) => b.viewedAt - a.viewedAt);

        const total = user.recentViews.filter((view) => view.documentId).length;

        return res.json({
            success: true,
            message: "User history retrieved successfully",
            data: {
                history,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        logger.error("Get User History Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: { code: "ERR_SERVER", message: "Server error while retrieving user history" },
        });
    }
};

// Lịch sử tải tài liệu
const getUserDownloads = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const user = await mongoose
            .model("User")
            .findById(req.user, "downloadHistory")
            .populate({
                path: "downloadHistory.documentId",
                select: "title slug",
                match: { isActive: true },
            })
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_USER_NOT_FOUND", message: "User not found" },
            });
        }

        const downloads = user.downloadHistory
            .filter((download) => download.documentId)
            .slice(skip, skip + parseInt(limit))
            .sort((a, b) => b.downloadedAt - a.downloadedAt);

        const total = user.downloadHistory.filter((download) => download.documentId).length;

        return res.json({
            success: true,
            message: "User downloads retrieved successfully",
            data: {
                downloads,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        logger.error("Get User Downloads Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: { code: "ERR_SERVER", message: "Server error while retrieving user downloads" },
        });
    }
};

// Danh sách tài liệu yêu thích
const getUserFavorites = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const user = await mongoose
            .model("User")
            .findById(req.user, "favoriteDocuments")
            .populate({
                path: "favoriteDocuments",
                select: "title slug",
                match: { isActive: true },
                options: { skip, limit: parseInt(limit) },
            })
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_USER_NOT_FOUND", message: "User not found" },
            });
        }

        const total = await mongoose
            .model("User")
            .findById(req.user)
            .then((u) => u.favoriteDocuments.length);

        return res.json({
            success: true,
            message: "User favorites retrieved successfully",
            data: {
                favorites: user.favoriteDocuments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        logger.error("Get User Favorites Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: { code: "ERR_SERVER", message: "Server error while retrieving user favorites" },
        });
    }
};

// Thêm/xóa tài liệu yêu thích
const toggleFavorite = async (req, res) => {
    try {
        const { docId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(docId)) {
            return res.status(400).json({
                success: false,
                error: { code: "ERR_INVALID_DOCUMENT", message: "Invalid document ID" },
            });
        }

        const user = await mongoose.model("User").findById(req.user);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_USER_NOT_FOUND", message: "User not found" },
            });
        }

        const document = await mongoose.model("Document").findOne({ _id: docId, isActive: true });
        if (!document) {
            return res.status(404).json({
                success: false,
                error: { code: "ERR_DOCUMENT_NOT_FOUND", message: "Document not found" },
            });
        }

        const index = user.favoriteDocuments.indexOf(docId);
        let action = "";
        if (index === -1) {
            user.favoriteDocuments.push(docId);
            action = "added";
        } else {
            user.favoriteDocuments.splice(index, 1);
            action = "removed";
        }
        await user.save();

        return res.json({
            success: true,
            message: `Document ${action} to favorites successfully`,
            data: { favoriteDocuments: user.favoriteDocuments },
        });
    } catch (error) {
        logger.error("Toggle Favorite Error", { error: error.message });
        return res.status(500).json({
            success: false,
            error: {
                code: "ERR_SERVER",
                message: "Server error while updating favorite documents",
            },
        });
    }
};

module.exports = {
    getUsers,
    getUserInfo,
    updateUserInfo,
    getUserHistory,
    getUserDownloads,
    getUserFavorites,
    toggleFavorite,
};
