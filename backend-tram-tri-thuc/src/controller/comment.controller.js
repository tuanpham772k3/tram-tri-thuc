const { Types } = require("mongoose");
const Comment = require("../models/comment.model");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { notifyDocumentOwner } = require("../utils/notification");
const { getPagination, buildMeta } = require("../utils/helper");

// Tạo bình luận
exports.createComment = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content } = req.body;

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Id tài liệu không hợp lệ.",
      });
    }

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Bình luận không được để trống.",
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bình luận tối đa 500 ký tự.",
      });
    }

    // Kiểm tra tài liệu
    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    const comment = await Comment.create({
      userId: req.user._id,
      documentId,
      content,
    });

    const user = await User.findById(req.user._id).select("name");

    await notifyDocumentOwner({
      documentId,
      actionUserId: req.user._id,
      type: "new_comment",
      actionUserName: user.name || req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: "Bình luận thành công",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể gửi bình luận",
    });
  }
};

// Lấy danh sách bình luận
exports.getCommentsByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { sortOrder = "desc" } = req.query;

    const { page, limit, skip } = getPagination(req.query);

    // Validation
    if (!Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({
        success: false,
        message: "ID tài liệu không hợp lệ",
      });
    }

    if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "Thứ tự sắp xếp chỉ hỗ trợ asc hoặc desc",
      });
    }

    const document = await Document.findById(documentId);
    if (!document || document.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Tài liệu không tồn tại.",
      });
    }

    const comments = await Comment.find({ documentId })
      .populate("userId", "name")
      .sort({ createdAt: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({ documentId });

    const pagingData = buildMeta(page, limit, total);

    return res.status(200).json({
      success: true,
      data: comments,
      meta: pagingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách bình luận",
    });
  }
};

// Cập nhật bình luận
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    // Validation
    if (!Types.ObjectId.isValid(commentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID bình luận không hợp lệ" });
    }

    if (!content || typeof content !== "string" || content.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bình luận không được để trống và tối đa 500 ký tự",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Bình luận không tồn tại" });
    }

    comment.content = content;
    comment.isEdited = true;
    comment.updatedAt = new Date();
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật bình luận thành công",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể cập nhật bình luận",
    });
  }
};

// Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Validation
    if (!Types.ObjectId.isValid(commentId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID bình luận không hợp lệ" });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Xóa bình luận thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể xóa bình luận",
    });
  }
};
