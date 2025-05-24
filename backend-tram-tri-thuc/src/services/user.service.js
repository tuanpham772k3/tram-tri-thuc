const mongoose = require("mongoose");
const User = require("../models/user.model");
const Rating = require("../models/rating.model");
const Document = require("../models/document.model");
const ViewHistory = require("../models/viewHistory.model");
const Download = require("../models/downloadHistory.model");
const logger = require("../utils/logger");
const { getPagination, getPagingData } = require("../utils/paginate");

class UserService {
    static async getUsers(queryParams = {}) {
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

    static async getUserInfo(userId) {
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

    static async updateUserInfo(userId, updateData) {
        try {
            // Có thể lọc các trường cho phép update ở đây nếu cần
            const allowedFields = ["name", "avatar", "email"];
            const filteredData = {};
            allowedFields.forEach((field) => {
                if (updateData[field] !== undefined) filteredData[field] = updateData[field];
            });

            if (filteredData.email) {
                const existingUser = await User.findOne({
                    email: filteredData.email,
                    _id: { $ne: userId },
                });
                if (existingUser) {
                    throw new Error("Email đã được sử dụng.");
                }
            }

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

    static async deleteMyAccount(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("Không tìm thấy người dùng");
            }

            // Soft delete tài liệu
            await Document.updateMany(
                { uploaderId: userId },
                { isPublic: false, status: "rejected" }
            );

            // Soft delete bình luận
            await Comment.updateMany({ userId }, { isDeleted: true });

            // Xóa đánh giá
            await Rating.deleteMany({ userId });

            // Xóa user
            await User.deleteOne({ _id: userId });

            logger.info(`Account deleted for userId: ${userId}`);
            return;
        } catch (error) {
            logger.error("Lỗi deleteMyAccount:", error);
            throw error;
        }
    }

    static async getUserHistory(userId, queryParams) {
        try {
            const { page, limit, skip } = getPagination(queryParams);

            const history = await ViewHistory.find({ userId })
                .populate("documentId", "title slug")
                .sort({ viewedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await ViewHistory.countDocuments({ userId });
            return getPagingData(history, total, page, limit);
        } catch (error) {
            logger.error("Lỗi getUserHistory:", error);
            throw error;
        }
    }

    static async getUserFavorites(userId, queryParams) {
        try {
            if (!mongoose.isValidObjectId(userId)) {
                throw new Error("ID người dùng không hợp lệ");
            }

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

            const total = user.favoriteDocuments.length;

            return getPagingData(user.favoriteDocuments, total, page, limit);
        } catch (error) {
            logger.error("Lỗi getUserFavorites:", error);
            throw error;
        }
    }

    static async toggleFavorite(userId, docId) {
        try {
            if (!mongoose.isValidObjectId(docId)) {
                throw new Error("ID tài liệu không hợp lệ");
            }

            const document = await Document.findById(docId);
            if (!document || document.status !== "approved") {
                throw new Error("Tài liệu không tồn tại hoặc chưa được duyệt.");
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

    static async getUserDownloads(userId, queryParams) {
        try {
            const { page, limit, skip } = getPagination(queryParams);

            const downloads = await Download.find({ userId })
                .populate("documentId", "title slug")
                .sort({ downloadedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await Download.countDocuments({ userId });
            return getPagingData(downloads, total, page, limit);
        } catch (error) {
            logger.error("Lỗi getUserDownloads:", error);
            throw error;
        }
    }
}
module.exports = UserService;
