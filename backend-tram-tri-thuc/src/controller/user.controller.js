const userService = require("../services/user.service");
const logger = require("../utils/logger");

async function getUsers(req, res) {
    try {
        const users = await userService.getUsers(req.query);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Lấy danh sách người dùng thành công",
            data: users,
        });
    } catch (error) {
        logger.error("Lỗi getUsers:", error);
        return res.status(400).json({
            success: false,
            status: 400,
            message: error.message || "Lỗi khi lấy danh sách người dùng",
        });
    }
}

async function getUserInfo(req, res) {
    try {
        const user = await userService.getUserInfo(req.user._id);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Lấy thông tin người dùng thành công",
            data: user,
        });
    } catch (error) {
        logger.error("Lỗi getUserInfo:", error);
        return res.status(404).json({
            success: false,
            status: 404,
            message: error.message || "Không tìm thấy người dùng",
        });
    }
}

async function updateUserInfo(req, res) {
    try {
        const user = await userService.updateUserInfo(req.user._id, req.body);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Cập nhật thông tin thành công",
            data: user,
        });
    } catch (error) {
        logger.error("Lỗi updateUserInfo:", error);
        return res.status(400).json({
            success: false,
            status: 400,
            message: error.message || "Lỗi khi cập nhật thông tin",
        });
    }
}

async function deleteMyAccount(req, res) {
    try {
        await userService.deleteMyAccount(req.user._id);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Xóa tài khoản thành công",
            data: null,
        });
    } catch (error) {
        logger.error("Lỗi deleteMyAccount:", error);
        return res.status(404).json({
            success: false,
            status: 404,
            message: error.message || "Không tìm thấy người dùng",
        });
    }
}

async function getUserHistory(req, res) {
    try {
        const history = await userService.getUserHistory(req.user._id, req.query);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Lấy lịch sử xem tài liệu thành công",
            data: history,
        });
    } catch (error) {
        logger.error("Lỗi getUserHistory:", error);
        return res.status(400).json({
            success: false,
            status: 400,
            message: error.message || "Lỗi khi lấy lịch sử xem",
        });
    }
}

async function getUserFavorites(req, res) {
    try {
        const favorites = await userService.getUserFavorites(req.user._id, req.query);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Lấy danh sách tài liệu yêu thích thành công",
            data: favorites,
        });
    } catch (error) {
        logger.error("Lỗi getUserFavorites:", error);
        return res.status(400).json({
            success: false,
            status: 400,
            message: error.message || "Lỗi khi lấy danh sách yêu thích",
        });
    }
}

async function toggleFavorite(req, res) {
    try {
        const { docId } = req.params;
        const result = await userService.toggleFavorite(req.user._id, docId);
        return res.status(200).json({
            success: true,
            status: 200,
            message: result.message,
            data: result.favorites,
        });
    } catch (error) {
        logger.error("Lỗi toggleFavorite:", error);
        return res.status(error.message.includes("Không tìm thấy") ? 404 : 400).json({
            success: false,
            status: error.message.includes("Không tìm thấy") ? 404 : 400,
            message: error.message || "Lỗi khi cập nhật yêu thích",
        });
    }
}

async function getUserDownloads(req, res) {
    try {
        const downloads = await userService.getUserDownloads(req.user._id, req.query);
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Lấy lịch sử tải tài liệu thành công",
            data: downloads,
        });
    } catch (error) {
        logger.error("Lỗi getUserDownloads:", error);
        return res.status(400).json({
            success: false,
            status: 400,
            message: error.message || "Lỗi khi lấy lịch sử tải",
        });
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
