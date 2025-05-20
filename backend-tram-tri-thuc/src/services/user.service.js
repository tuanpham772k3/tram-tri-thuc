const User = require("../models/user.model");
const logger = require("../utils/logger");
const { getPagination, getPagingData } = require("../utils/paginate");

async function getUsers(queryParams = {}) {
    try {
        const filter = { role: { $ne: "admin" } };

        const { page, limit, skip } = getPagination(queryParams);
        const total = await User.countDocuments(filter);

        const users = await User.find(filter)
            .select("-password -resetToken -token")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return getPagingData(users, total, page, limit);
    } catch (error) {
        logger.error("Lỗi getUsers:", error);
        throw new Error("Lỗi khi lấy danh sách người dùng");
    }
}

async function getUserInfo(userId) {
    try {
        const user = await User.findById(userId)
            .select("-password -resetToken -token")
            .populate("favoriteDocuments", "title description createdAt"); // Tùy chọn
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        return user;
    } catch (error) {
        logger.error("Lỗi getUserInfo:", error);
        throw error;
    }
}

async function updateUserInfo(userId, updateData) {
    try {
        // Có thể lọc các trường cho phép update ở đây nếu cần
        const allowedFields = ["name", "avatar", "email"];
        const filteredData = {};
        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) filteredData[field] = updateData[field];
        });

        const user = await User.findByIdAndUpdate(userId, filteredData, {
            new: true,
            runValidators: true,
        }).select("-password -resetToken -token");
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        return user;
    } catch (error) {
        logger.error("Lỗi updateUserInfo:", error);
        throw error;
    }
}

async function deleteMyAccount(userId) {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        return;
    } catch (error) {
        logger.error("Lỗi deleteMyAccount:", error);
        throw error;
    }
}

async function getUserHistory(userId, queryParams) {
    try {
        const { page, limit, skip } = getPagination(queryParams);

        const user = await User.findById(userId).select("recentViews");
        if (!user) throw new Error("Không tìm thấy người dùng");

        const total = user.recentViews.length;

        // Phân trang mảng recentViews trong code (MongoDB không hỗ trợ phân trang mảng con trực tiếp)
        const pagedViews = user.recentViews
            .sort((a, b) => b.viewedAt - a.viewedAt)
            .slice(skip, skip + limit);

        return getPagingData(pagedViews, total, page, limit);
    } catch (error) {
        logger.error("Lỗi getUserHistory:", error);
        throw error;
    }
}

async function getUserFavorites(userId, queryParams) {
    try {
        const { page, limit, skip } = getPagination(queryParams);

        const user = await User.findById(userId).populate({
            path: "favoriteDocuments",
            select: "title description createdAt", // Chỉ lấy các trường cần thiết
            options: {
                sort: { createdAt: -1 },
                skip,
                limit,
            },
        });

        if (!user) throw new Error("Không tìm thấy người dùng");

        const total = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userId) } },
            { $project: { total: { $size: "$favoriteDocuments" } } },
        ]).then((result) => result[0]?.total || 0);

        return getPagingData(user.favoriteDocuments, total, page, limit);
    } catch (error) {
        logger.error("Lỗi getUserFavorites:", error);
        throw error;
    }
}

async function toggleFavorite(userId, docId) {
    try {
        if (!mongoose.isValidObjectId(docId)) {
            throw new Error("ID tài liệu không hợp lệ");
        }

        const user = await User.findById(userId);
        if (!user) throw new Error("Không tìm thấy người dùng");

        const isFavorite = user.favoriteDocuments.includes(docId);
        if (isFavorite) {
            await User.updateOne({ _id: userId }, { $pull: { favoriteDocuments: docId } });
        } else {
            if (user.favoriteDocuments.length >= 100) {
                throw new Error("Danh sách yêu thích đã đạt giới hạn");
            }
            await User.updateOne({ _id: userId }, { $addToSet: { favoriteDocuments: docId } });
        }

        const updatedUser = await User.findById(userId).populate("favoriteDocuments");
        return {
            favorites: updatedUser.favoriteDocuments,
            message: isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
        };
    } catch (error) {
        logger.error("Lỗi toggleFavorite:", error);
        throw error;
    }
}

async function getUserDownloads(userId, queryParams) {
    try {
        const { page, limit, skip } = getPagination(queryParams);

        const user = await User.findById(userId).select("downloadHistory");
        if (!user) throw new Error("Không tìm thấy người dùng");

        const total = user.downloadHistory.length;

        const pagedDownloads = user.downloadHistory
            .sort((a, b) => b.downloadedAt - a.downloadedAt)
            .slice(skip, skip + limit);

        return getPagingData(pagedDownloads, total, page, limit);
    } catch (error) {
        logger.error("Lỗi getUserDownloads:", error);
        throw error;
    }
}

module.exports = {
    getUsers,
    getUserInfo,
    updateUserInfo,
    deleteMyAccount,
    getUserHistory,
    getUserFavorites,
    toggleFavorite,
    getUserDownloads,
};
