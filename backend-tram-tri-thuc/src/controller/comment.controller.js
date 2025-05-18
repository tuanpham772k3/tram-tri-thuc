const Comment = require('../models/Comments.model'); // Đảm bảo đã có model Comment
const Document = require('../models/Document.model'); // Nếu cần kiểm tra tài liệu
const mongoose = require('mongoose');

// Thêm bình luận mới
exports.addComment = async (req, res) => {
    try {
        const { documentId, content } = req.body;
        const userId = req.user._id;

        // Kiểm tra documentId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({ message: 'ID tài liệu không hợp lệ.' });
        }

        // Có thể kiểm tra tài liệu tồn tại nếu cần
        // const document = await Document.findById(documentId);
        // if (!document) return res.status(404).json({ message: 'Tài liệu không tồn tại.' });

        const comment = new Comment({
            document: documentId,
            user: userId,
            content,
        });

        await comment.save();
        res.status(201).json({ message: 'Bình luận đã được thêm.', comment });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// Lấy bình luận theo tài liệu
exports.getCommentsByDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({ message: 'ID tài liệu không hợp lệ.' });
        }

        const comments = await Comment.find({ document: documentId })
            .populate('user', 'name email') // Populate thông tin user nếu cần
            .sort({ createdAt: -1 });

        res.json({ comments });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// Xóa bình luận (user hoặc admin)
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID bình luận không hợp lệ.' });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Bình luận không tồn tại.' });
        }

        // Chỉ cho phép xóa nếu là admin hoặc chủ bình luận
        if (!isAdmin && comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này.' });
        }

        await comment.deleteOne();
        res.json({ message: 'Đã xóa bình luận.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};