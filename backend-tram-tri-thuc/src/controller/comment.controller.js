const { Types } = require("mongoose");
const Comment = require("../models/comment.model");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { notifyDocumentOwner } = require("../utils/notification");
const {
  getPagination,
  buildMeta,
  sendSuccess,
  AppError,
  asyncHandler,
} = require("../utils/helper");

// Tạo bình luận
exports.createComment = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { content } = req.body;

  // Validation documentId
  if (!Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Validation content
  if (!content || typeof content !== "string") {
    throw new AppError("Bình luận không được để trống.", 400);
  }

  if (content.length > 500) {
    throw new AppError("Bình luận tối đa 500 ký tự.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document || document.status !== "approved") {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  // Tạo comment
  const comment = await Comment.create({
    userId: req.user._id,
    documentId,
    content,
  });

  // Lấy thông tin người bình luận
  const user = await User.findById(req.user._id).select("name");

  // Thông báo cho chủ tài liệu
  await notifyDocumentOwner({
    documentId,
    actionUserId: req.user._id,
    type: "new_comment",
    actionUserName: user?.name || req.user.email,
  });

  return sendSuccess(res, comment, "Bình luận thành công.", 201);
});

// Lấy danh sách bình luận
exports.getCommentsByDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { page, limit, skip } = getPagination(req.query);

  // Validation
  if (!Types.ObjectId.isValid(documentId)) {
    throw new AppError("ID tài liệu không hợp lệ.", 400);
  }

  // Kiểm tra tài liệu
  const document = await Document.findById(documentId);

  if (!document) {
    throw new AppError("Tài liệu không tồn tại.", 404);
  }

  // Lấy danh sách comment
  const comments = await Comment.find({ documentId })
    .populate("userId", "name email")
    .skip(skip)
    .limit(limit)
    .lean();

  // Tổng số comment
  const totalComment = await Comment.countDocuments({
    documentId,
  });

  const meta = buildMeta(page, limit, totalComment);

  return sendSuccess(res, comments, "Lấy danh sách bình luận thành công.", 200, meta);
});

// Cập nhật bình luận
exports.updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  // Validation
  if (!Types.ObjectId.isValid(commentId)) {
    throw new AppError("ID bình luận không hợp lệ.", 400);
  }

  if (!content || typeof content !== "string") {
    throw new AppError("Bình luận không được để trống.", 400);
  }

  if (content.length > 500) {
    throw new AppError("Bình luận tối đa 500 ký tự.", 400);
  }

  // Tìm comment
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError("Bình luận không tồn tại.", 404);
  }

  // Cập nhật
  comment.content = content;
  comment.isEdited = true;
  comment.updatedAt = new Date();

  await comment.save();

  return sendSuccess(res, comment, "Cập nhật bình luận thành công.");
});

// Xóa bình luận
exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // Validation
  if (!Types.ObjectId.isValid(commentId)) {
    throw new AppError("ID bình luận không hợp lệ.", 400);
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError("Bình luận không tồn tại.", 404);
  }

  await Comment.findByIdAndDelete(commentId);

  return sendSuccess(res, null, "Xóa bình luận thành công.");
});
